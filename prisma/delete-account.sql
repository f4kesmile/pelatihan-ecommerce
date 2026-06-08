-- DELETE ACCOUNT BY EMAIL
-- Gunakan ini jika Anda ingin menghapus akun agar bisa Mendaftar Ulang.
-- Ganti 'EMAIL_ANDA_DISINI' dengan email login Anda.

DELETE FROM auth.users 
WHERE email = 'EMAIL_ANDA_DISINI';

-- Contoh:
-- DELETE FROM auth.users WHERE email = 'saya@gmail.com';
