-- Resolves a normalized username to its Auth email without exposing profile
-- rows to anonymous clients. The function only returns one email for login.
CREATE OR REPLACE FUNCTION public.email_para_nombre_usuario(nombre_usuario_buscado text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT u.email::text
  FROM auth.users AS u
  JOIN public.perfiles AS p ON p.id = u.id
  WHERE lower(btrim(p.nombre_usuario)) = lower(btrim(nombre_usuario_buscado))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.email_para_nombre_usuario(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.email_para_nombre_usuario(text) TO anon, authenticated;
