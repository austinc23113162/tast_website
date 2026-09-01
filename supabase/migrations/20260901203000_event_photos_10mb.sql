-- Raise event photo uploads from 5 MB to 10 MB.

update storage.buckets
set file_size_limit = 10485760
where id = 'event-photos';
