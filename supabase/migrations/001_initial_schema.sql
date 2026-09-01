-- =============================================
-- PROMPT GALLERY - DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- ============ PROFILES ============
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text default '',
  avatar_url text,
  language text default 'en',
  theme text default 'dark',
  created_at timestamptz default now()
);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============ PROMPTS ============
create table if not exists public.prompts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text default '',
  prompt text not null,
  image_url text,
  category text default '',
  subcategory text default '',
  ai_model text default '',
  language text default 'en',
  tags text[] default '{}',
  favorite boolean default false,
  usage_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists prompts_user_id_idx on public.prompts(user_id);
create index if not exists prompts_category_idx on public.prompts(category);
create index if not exists prompts_ai_model_idx on public.prompts(ai_model);

-- ============ PROMPT VERSIONS ============
create table if not exists public.prompt_versions (
  id uuid default gen_random_uuid() primary key,
  prompt_id uuid references public.prompts(id) on delete cascade not null,
  version integer not null,
  title text not null,
  description text default '',
  prompt text not null,
  image_url text,
  ai_model text default '',
  tags text[] default '{}',
  changes text default '',
  created_at timestamptz default now()
);

create index if not exists prompt_versions_prompt_id_idx on public.prompt_versions(prompt_id);

-- ============ COLLECTIONS ============
create table if not exists public.collections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text default '',
  icon text default '📁',
  created_at timestamptz default now()
);

create index if not exists collections_user_id_idx on public.collections(user_id);

-- ============ COLLECTION PROMPTS (junction) ============
create table if not exists public.collection_prompts (
  collection_id uuid references public.collections(id) on delete cascade,
  prompt_id uuid references public.prompts(id) on delete cascade,
  added_at timestamptz default now(),
  primary key (collection_id, prompt_id)
);

create index if not exists collection_prompts_prompt_idx on public.collection_prompts(prompt_id);

-- ============ USAGE COUNTER RPC ============
create or replace function public.increment_usage(prompt_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.prompts
  set usage_count = usage_count + 1
  where id = prompt_id and user_id = auth.uid();
end;
$$;

-- ============ STORAGE BUCKET ============
insert into storage.buckets (id, name, public)
values ('prompt-images', 'prompt-images', true)
on conflict (id) do nothing;

-- ============ ROW LEVEL SECURITY ============
alter table public.prompts enable row level security;
alter table public.prompt_versions enable row level security;
alter table public.collections enable row level security;
alter table public.collection_prompts enable row level security;
alter table public.profiles enable row level security;

-- prompts: users only manage their own
create policy "prompts_select_own" on public.prompts for select using (auth.uid() = user_id);
create policy "prompts_insert_own" on public.prompts for insert with check (auth.uid() = user_id);
create policy "prompts_update_own" on public.prompts for update using (auth.uid() = user_id);
create policy "prompts_delete_own" on public.prompts for delete using (auth.uid() = user_id);

-- versions: users manage versions of their prompts
create policy "versions_select_own" on public.prompt_versions
  for select using (
    exists (select 1 from public.prompts p where p.id = prompt_id and p.user_id = auth.uid())
  );
create policy "versions_insert_own" on public.prompt_versions
  for insert with check (
    exists (select 1 from public.prompts p where p.id = prompt_id and p.user_id = auth.uid())
  );
create policy "versions_delete_own" on public.prompt_versions
  for delete using (
    exists (select 1 from public.prompts p where p.id = prompt_id and p.user_id = auth.uid())
  );

-- collections
create policy "collections_select_own" on public.collections for select using (auth.uid() = user_id);
create policy "collections_insert_own" on public.collections for insert with check (auth.uid() = user_id);
create policy "collections_update_own" on public.collections for update using (auth.uid() = user_id);
create policy "collections_delete_own" on public.collections for delete using (auth.uid() = user_id);

-- collection_prompts
create policy "cp_manage_own" on public.collection_prompts
  for all using (
    exists (select 1 from public.collections c where c.id = collection_id and c.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.collections c where c.id = collection_id and c.user_id = auth.uid())
  );

-- profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- ============ STORAGE POLICY ============
create policy "public_read_images" on storage.objects
  for select using (bucket_id = 'prompt-images');

create policy "auth_upload_images" on storage.objects
  for insert with check (bucket_id = 'prompt-images' and auth.role() = 'authenticated');

create policy "auth_update_images" on storage.objects
  for update using (bucket_id = 'prompt-images' and auth.role() = 'authenticated');

create policy "auth_delete_images" on storage.objects
  for delete using (bucket_id = 'prompt-images' and auth.role() = 'authenticated');
