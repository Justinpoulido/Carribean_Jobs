insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 5242880, array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Applicants can upload CVs" on storage.objects;
create policy "Applicants can upload CVs"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'resumes');
