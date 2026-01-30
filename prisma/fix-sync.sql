-- RESTORE USER PROFILES FROM AUTH
-- Run this if you can login but your profile data is missing.

INSERT INTO public."UserProfile" (
    "id", 
    "supabaseUserId", 
    "email", 
    "fullName", 
    "role", 
    "updatedAt"
)
SELECT 
    id::text,                  -- Use Auth ID as Profile ID for simplicity, or gen_random_uuid()
    id::text,                  -- Supabase User ID matches Auth ID
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Recovered User'), -- Fallback name
    'ADMIN',                   -- RESTORE AS ADMIN (Change to 'USER' if needed)
    NOW()
FROM auth.users
WHERE id::text NOT IN (SELECT "supabaseUserId" FROM public."UserProfile")
ON CONFLICT ("supabaseUserId") DO NOTHING;

-- Output success message
SELECT 'Profiles synced successfully' as result;
