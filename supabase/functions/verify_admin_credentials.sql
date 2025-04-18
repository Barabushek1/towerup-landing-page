
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    admin_users.id,
    admin_users.email,
    admin_users.name
  FROM admin_users
  WHERE 
    admin_users.email = p_email
    AND admin_users.password_hash = crypt(p_password, admin_users.password_hash);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.verify_admin_credentials(TEXT, TEXT) TO authenticated;
