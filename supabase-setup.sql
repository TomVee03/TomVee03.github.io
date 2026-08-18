create table if not exists public.films (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  historical_date text,
  location text,
  era text,
  description text not null,
  historical_context text,
  sources text[] not null default '{}',
  video_url text not null,
  thumbnail_url text,
  published boolean not null default false,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.films enable row level security;

grant select on public.films to anon, authenticated;
grant insert, update, delete on public.films to authenticated;

create policy "Public can read published films"
on public.films for select
to anon
using (published = true);

create policy "Creators can read own films"
on public.films for select
to authenticated
using (created_by = auth.uid() or published = true);

create policy "Creators can insert own films"
on public.films for insert
to authenticated
with check (created_by = auth.uid());

create policy "Creators can update own films"
on public.films for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

create policy "Creators can delete own films"
on public.films for delete
to authenticated
using (created_by = auth.uid());

create policy "Authenticated creators can upload film media"
on storage.objects for insert
to authenticated
with check (bucket_id in ('films','thumbnails') and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Creators can update own film media"
on storage.objects for update
to authenticated
using (bucket_id in ('films','thumbnails') and owner_id = auth.uid()::text)
with check (bucket_id in ('films','thumbnails') and owner_id = auth.uid()::text);

create policy "Creators can delete own film media"
on storage.objects for delete
to authenticated
using (bucket_id in ('films','thumbnails') and owner_id = auth.uid()::text);
