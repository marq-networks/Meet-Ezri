-- Rename table therapist_profiles to companion_profiles
ALTER TABLE IF EXISTS public.therapist_profiles RENAME TO companion_profiles;

-- Rename column therapist_id to companion_id in appointments table
ALTER TABLE IF EXISTS public.appointments RENAME COLUMN therapist_id TO companion_id;
