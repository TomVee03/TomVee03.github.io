# Chronicle AI production backend setup

GitHub Pages serves the front end, but it does not run server-side application code. Chronicle AI therefore uses Supabase for creator login, the film database, and media storage.

## 1. Create a Supabase project
Create a project at Supabase. In Project Settings > API, copy the Project URL and the publishable/anon key. Do **not** use or publish the service-role key.

Edit `supabase-config.js` and replace the two placeholder values with the Project URL and publishable key.

## 2. Create the database and security policies
Open the Supabase SQL Editor and run the entire contents of `supabase-setup.sql`.

## 3. Create storage buckets
In Storage, create two **public** buckets named exactly:
- `films`
- `thumbnails`

Public retrieval is intentional because published films and thumbnails are public media. Uploads remain restricted by the policies in `supabase-setup.sql`.

For the `films` bucket, set the maximum file size high enough for the clips you intend to upload and allow video MIME types. For `thumbnails`, allow image MIME types.

## 4. Create your creator account
In Authentication > Users, create your own user with email and password. For this initial single-creator build, disable public user sign-ups in Authentication settings so strangers cannot create creator accounts.

## 5. Test the workflow
Visit `https://tomvee03.github.io/admin.html`, sign in, fill out a production, choose a thumbnail and video, and save it. If you check **Publish immediately**, the film becomes publicly readable at:

`https://tomvee03.github.io/film.html?slug=YOUR-SLUG`

## Security notes
The publishable/anon key is expected to be visible in browser code. Security comes from Row Level Security policies. Never place the Supabase service-role key in this repository or any browser JavaScript.
