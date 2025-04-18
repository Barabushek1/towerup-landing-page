
-- Check if admin user already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE email = 'towerup@admin.ru') THEN
    -- Insert default admin user with password 'Towerup_admin1234'
    INSERT INTO admin_users (email, name, password_hash)
    VALUES ('towerup@admin.ru', 'Admin User', crypt('Towerup_admin1234', gen_salt('bf')));
  END IF;
END
$$;
