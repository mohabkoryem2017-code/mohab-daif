# Orbit AI test setup

This endpoint is intentionally limited to three fixed, fictional prompts. It does not accept arbitrary user messages, contacts, schedules, or real-estate records. Keep the Google AI key in Supabase Edge Function Secrets as `GEMINI_API_KEY`; never put it in `index.html`, `settings.js`, GitHub, or the browser.

The `orbit-ai-demo` Edge Function has been deployed to the Orbit Supabase project. It requires a signed-in Supabase user and checks that user's access token against Supabase Auth. Its deployed code is restricted to three fixed, fictional demo IDs. It is not yet connected to the published GitHub Pages app.

Before deployment:

1. Add `GEMINI_API_KEY` through the Supabase Dashboard's Edge Function Secrets page. Do not put the key in app code or share it in chat.
2. Create a Supabase publishable key for the Orbit web client and put it in `supabase-config.js`. The project URL is already present there.
3. Publish the updated PWA files to GitHub Pages, then create/sign in to the Orbit app with email and password.
4. Test only the three built-in fictional examples until a separate privacy decision is made for real schedules, workouts, leads, or property records.

Google's free Gemini API tier may use submitted data to improve its products. This demo endpoint avoids that exposure by accepting only fixed sample prompts.
