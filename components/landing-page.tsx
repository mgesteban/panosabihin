"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { 
  Languages, 
  Mic, 
  Type, 
  ArrowUpDown, 
  Zap, 
  Shield, 
  Globe, 
  Users,
  CheckCircle,
  Play,
  FileText,
  HelpCircle,
  Lock,
  Scale
} from "lucide-react"
import Image from "next/image"
import BidirectionalTranslationApp from "./bidirectional-translation-app"
import { User } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  email: string
  translation_count: number
  has_paid: boolean
}

interface LandingPageProps {
  user?: User
  userProfile?: UserProfile
  updateUserProfile?: (updates: Partial<UserProfile>) => Promise<UserProfile | undefined>
  canTranslate?: boolean
  remainingTranslations?: number
}

export default function LandingPage({ 
  user, 
  userProfile, 
  updateUserProfile, 
  canTranslate = true, 
  remainingTranslations = 100 
}: LandingPageProps) {
  const [activeTab, setActiveTab] = useState("app")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px]">
              <Image
                src="/images/panosabihinlogo.png"
                alt="Panosabihin - Universal Translation Assistant"
                fill
                sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 150px"
                priority
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            Panosabihin
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto px-4 leading-relaxed">
            Your Universal Translation Assistant - Speak or type in any language for instant, accurate translations
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 px-2">
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
              <Languages className="h-3 w-3" />
              <span className="hidden sm:inline">100+ Languages</span>
              <span className="sm:hidden">100+</span>
            </Badge>
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
              <Mic className="h-3 w-3" />
              <span className="hidden sm:inline">Voice Recognition</span>
              <span className="sm:hidden">Voice</span>
            </Badge>
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
              <Zap className="h-3 w-3" />
              <span className="hidden sm:inline">Instant Translation</span>
              <span className="sm:hidden">Instant</span>
            </Badge>
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
              <ArrowUpDown className="h-3 w-3" />
              <span className="hidden sm:inline">Bidirectional</span>
              <span className="sm:hidden">2-Way</span>
            </Badge>
          </div>
        </header>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 sm:mb-8 h-12 sm:h-auto">
            <TabsTrigger value="app" className="gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Try App</span>
              <span className="sm:hidden">App</span>
            </TabsTrigger>
            <TabsTrigger value="how-to" className="gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">How to Use</span>
              <span className="sm:hidden">Guide</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Privacy</span>
              <span className="sm:hidden">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="terms" className="gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <Scale className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Terms</span>
              <span className="sm:hidden">Terms</span>
            </TabsTrigger>
          </TabsList>

          {/* App Tab */}
          <TabsContent value="app" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Try Panosabihin Now</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Start with 100 free translations - no signup required!
              </p>
            </div>
            <BidirectionalTranslationApp 
              user={user}
              userProfile={userProfile}
              updateUserProfile={updateUserProfile}
              canTranslate={canTranslate}
              remainingTranslations={remainingTranslations}
            />
          </TabsContent>

          {/* How to Use Tab */}
          <TabsContent value="how-to" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  How to Use Panosabihin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Voice Input Guide */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Mic className="h-5 w-5 text-blue-500" />
                        Voice Translation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mt-1">
                          <span className="text-blue-600 dark:text-blue-300 text-sm font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Click the Microphone</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Tap the microphone button to start voice recognition
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mt-1">
                          <span className="text-blue-600 dark:text-blue-300 text-sm font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Speak Clearly</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Speak in any language - Panosabihin will detect it automatically
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mt-1">
                          <span className="text-blue-600 dark:text-blue-300 text-sm font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Get Instant Translation</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Your speech will be automatically translated and displayed
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Text Input Guide */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Type className="h-5 w-5 text-green-500" />
                        Text Translation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mt-1">
                          <span className="text-green-600 dark:text-green-300 text-sm font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Type Your Text</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Enter text in any language in the input field
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mt-1">
                          <span className="text-green-600 dark:text-green-300 text-sm font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Choose Direction</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Use Auto-detect or manually select translation direction
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mt-1">
                          <span className="text-green-600 dark:text-green-300 text-sm font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Click Translate</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Press the translate button to get your result
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* Features Overview */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <ArrowUpDown className="h-5 w-5 text-purple-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Bidirectional Translation</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Translate from any language to English or from English to your native language
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-orange-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Conversation Mode</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Perfect for ESL conversations with automatic language detection
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-blue-500 mt-1" />
                      <div>
                        <h4 className="font-medium">100+ Languages</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Support for over 100 languages with high accuracy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-yellow-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Instant Results</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Get translations in under 3 seconds with AI-powered accuracy
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tips for Best Results */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Tips for Best Results</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Speak Clearly</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          For voice input, speak clearly and at a normal pace for best recognition
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Use Chrome Browser</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Chrome provides the best voice recognition experience, especially for Filipino/Tagalog
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Enable Microphone</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Allow microphone access when prompted for voice translation features
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Try Conversation Mode</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Enable conversation mode for seamless back-and-forth translations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is Panosabihin?</AccordionTrigger>
                    <AccordionContent>
                      Panosabihin is a universal translation assistant that helps you translate text and speech between any language and English. It's perfect for ESL conversations, language learning, travel, and communication across language barriers.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>How many languages does Panosabihin support?</AccordionTrigger>
                    <AccordionContent>
                      Panosabihin supports over 100 languages for text translation. Voice recognition works best with major languages like English, Spanish, Filipino/Tagalog, Chinese, Hindi, and many others. The app automatically detects the language you're speaking or typing.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is Panosabihin free to use?</AccordionTrigger>
                    <AccordionContent>
                      Yes! Panosabihin offers 100 free translations to get you started. After that, you can upgrade to unlimited translations for $9/month. No signup is required to try the free translations.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>How accurate are the translations?</AccordionTrigger>
                    <AccordionContent>
                      Panosabihin uses advanced AI technology (GPT-4) to provide highly accurate translations. The quality is excellent for everyday conversations, business communication, and academic use. Complex technical terms or highly specialized content may require human review.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>Does voice recognition work on mobile devices?</AccordionTrigger>
                    <AccordionContent>
                      Yes! Voice recognition works on most modern mobile browsers, especially Chrome on Android and Safari on iOS. Make sure to allow microphone access when prompted. The app is fully responsive and optimized for mobile use.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>What is Conversation Mode?</AccordionTrigger>
                    <AccordionContent>
                      Conversation Mode automatically detects whether you're speaking in English or your native language and translates accordingly. This makes it perfect for ESL conversations where you need to switch between languages seamlessly.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger>Can I use Panosabihin offline?</AccordionTrigger>
                    <AccordionContent>
                      No, Panosabihin requires an internet connection to function as it uses cloud-based AI for translation. This ensures you always get the most accurate and up-to-date translations.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger>Which browsers work best with Panosabihin?</AccordionTrigger>
                    <AccordionContent>
                      Chrome provides the best experience, especially for voice recognition in Filipino/Tagalog and other languages. Firefox, Safari, and Edge also work well for text translation. Voice features may be limited in some browsers.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-9">
                    <AccordionTrigger>How do I get the best voice recognition results?</AccordionTrigger>
                    <AccordionContent>
                      For best results: use Chrome browser, speak clearly at normal pace, ensure good microphone quality, minimize background noise, and allow microphone access when prompted. The app automatically cycles through different language settings to find the best match.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-10">
                    <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can cancel your subscription at any time. Your unlimited access will continue until the end of your current billing period. There are no cancellation fees or penalties.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                  </p>
                  <p className="mb-4">
                    At Panosabihin, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our translation service.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Translation Data</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        We process the text and voice input you provide for translation purposes. This data is sent to our AI translation service and is not stored permanently on our servers.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Account Information</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        If you create an account, we collect your email address and track your translation usage for billing purposes.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Usage Analytics</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        We collect anonymous usage statistics to improve our service, including translation counts and error rates.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">How We Use Your Information</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      To provide translation services
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      To manage your account and billing
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      To improve our service quality
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      To provide customer support
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Data Security</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    We implement industry-standard security measures to protect your data:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
                      All data transmission is encrypted using HTTPS
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
                      Translation data is not stored permanently
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
                      Account data is stored securely with encryption
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
                      Regular security audits and updates
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Third-Party Services</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    We use the following third-party services:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li><strong>OpenAI:</strong> For AI-powered translation services</li>
                    <li><strong>Supabase:</strong> For user authentication and data storage</li>
                    <li><strong>Stripe:</strong> For secure payment processing</li>
                    <li><strong>Vercel:</strong> For hosting and deployment</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    You have the right to:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Access your personal data</li>
                    <li>• Correct inaccurate data</li>
                    <li>• Delete your account and data</li>
                    <li>• Export your data</li>
                    <li>• Opt out of analytics</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    If you have any questions about this Privacy Policy or your data, please contact us at grace@boardbreeze.io
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terms Tab */}
          <TabsContent value="terms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Terms of Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                  </p>
                  <p className="mb-4">
                    Welcome to Panosabihin. These Terms of Use govern your use of our translation service. By using Panosabihin, you agree to these terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">1. Service Description</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Panosabihin is a web-based translation service that uses artificial intelligence to translate text and speech between different languages. We provide both free and paid tiers of service.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">2. Acceptable Use</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p><strong>You may use Panosabihin for:</strong></p>
                    <ul className="space-y-1 ml-4">
                      <li>• Personal communication and learning</li>
                      <li>• Business and professional translation needs</li>
                      <li>• Educational purposes</li>
                      <li>• Travel and tourism assistance</li>
                    </ul>
                    <p className="mt-3"><strong>You may not use Panosabihin for:</strong></p>
                    <ul className="space-y-1 ml-4">
                      <li>• Illegal activities or content</li>
                      <li>• Harassment, hate speech, or harmful content</li>
                      <li>• Spamming or automated abuse</li>
                      <li>• Violating intellectual property rights</li>
                      <li>• Reverse engineering or attempting to access our systems</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">3. Free and Paid Services</h3>
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <div>
                      <h4 className="font-medium">Free Tier</h4>
                      <p>We provide 100 free translations per user. No account creation is required for the free tier.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Paid Tier</h4>
                      <p>Our unlimited plan costs $9/month and provides unlimited translations. Payment is processed securely through Stripe.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Billing and Cancellation</h4>
                      <p>Subscriptions are billed monthly. You may cancel at any time, and your access will continue until the end of your billing period.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">4. Translation Accuracy</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    While we strive for high accuracy using advanced AI technology, translations are provided "as is" and may not be perfect. We recommend human review for critical communications, legal documents, or medical content.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">5. Data and Privacy</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your use of Panosabihin is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. By using our service, you consent to the collection and use of information as described in our Privacy Policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">6. Intellectual Property</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Panosabihin and all related content, features, and functionality are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">7. Limitation of Liability</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Panosabihin is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to translation errors, service interruptions, or data loss.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">8. Changes to Terms</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We may update these Terms of Use from time to time. We will notify users of any material changes by posting the new terms on this page. Your continued use of Panosabihin after changes constitutes acceptance of the new terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">9. Contact Information</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    If you have any questions about these Terms of Use, please contact us at grace@boardbreeze.io
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
