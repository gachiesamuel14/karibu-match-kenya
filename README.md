# Karibu Match — Kenya location-based dating

A demo dating web app for people in Kenya. Match by county, distance, age, and interests.

## Live demo
Connect this repo to Netlify (auto-deploys from `main`).

## What works in this demo
- Registration / login (saved in your browser)
- Profile setup (photos as data URLs, county, tribe, religion, interests)
- Discover / swipe nearby mock profiles across Kenyan counties
- Filters: county, max distance, age, religion
- Matches list and mock chat
- Report / safety flow
- Premium upsell (M-Pesa copy — not a live payment)

## What is *not* production-ready yet
Real GPS matching, photo hosting, real-time chat, push notifications, and M-Pesa need a backend (Firebase, Supabase, or Node + Postgres). This frontend is the product shell you can iterate on.

## Local preview
Open `index.html` in a browser, or:

```bash
npx serve .
```

## Next steps
1. Replace mock users with a database
2. Add Auth (Supabase Auth or Firebase Auth)
3. Store photos in Cloudinary / Firebase Storage
4. Use browser Geolocation + Haversine for real distance
5. Add WebSockets or Supabase Realtime for chat
6. Integrate Daraja API for M-Pesa subscriptions
