# Orbit AI test setup

This endpoint is intentionally limited to three fixed, fictional prompts. It does not accept arbitrary user messages, contacts, schedules, or real-estate records. Keep the Google AI key in Supabase Edge Function Secrets as `GEMINI_API_KEY`; never put it in `index.html`, `settings.js`, GitHub, or the browser.

The function requires a signed-in Supabase user (`verify_jwt = true`). It will not run until the app has a Supabase project, authentication, and a user session. The current GitHub Pages prototype has none of those, so the function is a safe scaffold and is not live yet.

Before deployment:

1. Create a Supabase project on the free tier.
2. Configure email sign-in and set the allowed redirect URLs for the Orbit site.
3. Add `GEMINI_API_KEY` through the Supabase Dashboard's Edge Function Secrets page.
4. Deploy `orbit-ai-demo` and set up the browser client with the Supabase project URL and publishable key. The publishable key is safe only alongside correct Row Level Security; the Gemini key stays server-side.
5. Test only the built-in fictional examples. Do not send client names, phone numbers, or personal records to the free-tier model.

Google's free Gemini API tier may use submitted data to improve its products. This demo endpoint avoids that exposure by accepting only fixed sample prompts.
