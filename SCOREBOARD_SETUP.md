# Daily Scoreboard Email

Every morning at 7am Pacific (8am during daylight saving), Vercel calls `/api/scoreboard`. It emails a summary of the previous day:

- **Who used it:** visitors, active signed-in users, visits, and translations
- **Time in app:** total time, average per visitor, and longest visit
- **Members:** total accounts, new sign-ups, paying users, average time as a member, and all-time translations, plus a table of signed-in users who were active that day
- **OpenAI:** tokens used and cost (yesterday and month to date)

Visits and translations are only recorded from the day this is deployed. There's no history from before then.

## One-time setup

1. **Create the tracking tables.** In Supabase, open **SQL Editor**, paste in `supabase/scoreboard.sql`, and run it.
2. **Add these environment variables in Vercel** (Project → Settings → Environment Variables):

   | Variable | Where to get it |
   | --- | --- |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` key. Keep it secret. It's only used on the server. |
   | `RESEND_API_KEY` | Sign up at [resend.com](https://resend.com) → API Keys → Create. |
   | `SCOREBOARD_EMAIL_TO` | The address that should receive the report. Separate several with commas. |
   | `CRON_SECRET` | Any random string of 16+ characters. Vercel sends it automatically when it calls the scheduled job. |
   | `OPENAI_ADMIN_KEY` | *Optional.* platform.openai.com → Settings → Organization → Admin keys. Without it, cost is estimated from tokens. |
   | `SCOREBOARD_EMAIL_FROM` | *Optional.* Only after you verify your own domain in Resend, e.g. `Panosabihin <reports@yourdomain.com>`. |

   **Resend without a domain:** until you verify a domain, Resend only sends to the email address you signed up with. Either sign up with the address in `SCOREBOARD_EMAIL_TO`, or verify a domain.
3. **Redeploy** so the new variables and the schedule in `vercel.json` take effect.

## Checking it

See the report without sending it:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" "https://YOUR-SITE.vercel.app/api/scoreboard?preview=1" > preview.html
```

Send it right away (same command without `?preview=1`). Anything that isn't set up yet appears under **Setup notes** at the bottom of the email.
