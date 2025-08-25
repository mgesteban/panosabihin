"use client"

import React, { useEffect, useState } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import AuthForm from "./auth-form"
import { Button } from "@/components/ui/button"
import { LogOut, User as UserIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AuthWrapperProps {
  children: React.ReactNode
}

interface UserProfile {
  id: string
  email: string
  translation_count: number
  has_paid: boolean
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const supabase = createSupabaseClient()

  // Check initial session and set up auth listener
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email)
      }
      
      setIsLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email)
        } else {
          setUserProfile(null)
        }
        
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Fetch or create user profile
  const fetchUserProfile = async (userId: string, userEmail?: string) => {
    try {
      // First, try to get existing profile
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (fetchError && fetchError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        // Get current user data if email not provided
        const email = userEmail || user?.email || ''
        
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            email: email,
            translation_count: 0,
            has_paid: false
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating user profile:', createError)
          return
        }

        setUserProfile(newProfile)
      } else if (fetchError) {
        console.error('Error fetching user profile:', fetchError)
      } else {
        setUserProfile(profile)
      }
    } catch (error) {
      console.error('Error managing user profile:', error)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setIsAuthenticating(false)
    toast({
      title: "Welcome!",
      description: "You can now start translating.",
    })
  }

  // Update user profile (for translation count, payment status)
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      setUserProfile(data)
      return data
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  // Check if user can translate (hasn't exceeded free limit)
  const canTranslate = () => {
    if (!userProfile) return false
    return userProfile.has_paid || userProfile.translation_count < 100
  }

  // Get remaining free translations
  const getRemainingTranslations = () => {
    if (!userProfile) return 0
    if (userProfile.has_paid) return Infinity
    return Math.max(0, 100 - userProfile.translation_count)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - show landing page with limited functionality
  if (!user) {
    return (
      <div className="min-h-screen">
        {React.cloneElement(children as React.ReactElement, {
          user: null,
          userProfile: null,
          updateUserProfile: undefined,
          canTranslate: true, // Allow free translations for unauthenticated users
          remainingTranslations: 100,
        })}
      </div>
    )
  }

  // Authenticated - show app with user info
  return (
    <div className="min-h-screen">
      {/* User header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="text-sm text-muted-foreground">
                {userProfile.has_paid ? (
                  <span className="text-green-600 font-medium">Unlimited</span>
                ) : (
                  <span>
                    {getRemainingTranslations()} free translations left
                  </span>
                )}
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-6">
        {React.cloneElement(children as React.ReactElement, {
          user,
          userProfile,
          updateUserProfile,
          canTranslate: canTranslate(),
          remainingTranslations: getRemainingTranslations(),
        })}
      </div>
    </div>
  )
}
