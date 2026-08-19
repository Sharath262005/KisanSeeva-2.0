-- Auth Performance Indexes
-- Run once against the Supabase/PostgreSQL database to speed up login queries.
--
-- The login query does: WHERE email = $1 (full table scan without this index)
-- The OTP send/verify does: WHERE phone = $1
-- The reset password does: WHERE reset_password_token = $1

CREATE INDEX IF NOT EXISTS idx_users_email
  ON users (email);

CREATE INDEX IF NOT EXISTS idx_users_phone
  ON users (phone);

CREATE INDEX IF NOT EXISTS idx_users_reset_token
  ON users (reset_password_token)
  WHERE reset_password_token IS NOT NULL;
