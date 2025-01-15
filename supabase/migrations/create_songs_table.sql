create table if not exists public.songs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  video_id text not null,
  thumbnail_url text not null,
  status text not null default 'in-progress' check (status in ('in-progress', 'mastered')),
  notes text default '',
  order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);