# Chronicle AI — Website Prototype v1

A dependency-free prototype for a cinematic AI history film platform.

## What works now

- Cinematic responsive homepage
- Featured film section
- Film cards and category filters
- Search interface
- Era browsing
- Film/watch modal preview
- Historical reconstruction transparency system
- Creator Studio front-end preview
- Mobile layout

## Run it locally

You can simply double-click `index.html`, or serve it locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## What is not connected yet

This is currently a front-end prototype. It does not yet have:

- User authentication
- Database storage
- Real creator/admin accounts
- Cloud video uploads
- Video streaming/CDN
- Persistent film records
- Real source citation records
- Production deployment configuration

## Recommended production architecture

The next version should migrate this design to a full-stack app, likely using:

- Next.js / React
- PostgreSQL or Supabase for film metadata
- Supabase Auth, Clerk, or Auth.js for creator authentication
- Mux, Cloudflare Stream, or similar for video hosting/streaming
- Vercel or equivalent for deployment

The existing prototype can serve as the design reference for that build.
