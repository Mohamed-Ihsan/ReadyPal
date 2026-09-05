-- Ensures the "avatars" bucket used by uploadProfilePhoto() (src/lib/api.ts)
-- actually exists, is public, and has RLS policies letting anyone read a
-- photo while only letting a user write to their own `${user.id}/...` path.
-- Without this, supabase.storage.from('avatars').getPublicUrl(path) still
-- returns a URL, but the object itself 403s when the <img> tries to load it
-- — the most common cause of an avatar "not loading" even though the app
-- code is otherwise correct.

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'Public read access for avatars'
  ) then
    create policy "Public read access for avatars"
      on storage.objects for select
      using (bucket_id = 'avatars');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'Users can upload their own avatar'
  ) then
    create policy "Users can upload their own avatar"
      on storage.objects for insert
      with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'Users can update their own avatar'
  ) then
    create policy "Users can update their own avatar"
      on storage.objects for update
      using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'Users can delete their own avatar'
  ) then
    create policy "Users can delete their own avatar"
      on storage.objects for delete
      using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
  end if;
end $$;
