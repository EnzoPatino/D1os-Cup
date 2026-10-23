-- Añade un nombre de usuario normalizado para permitir búsqueda segura desde
-- la función de Vercel sin exponer correos en el cliente público.
ALTER TABLE public.perfiles
  ADD COLUMN nombre_usuario_login text
  GENERATED ALWAYS AS (lower(btrim(nombre_usuario))) STORED;

DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.perfiles
    GROUP BY lower(btrim(nombre_usuario))
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Hay nombres de usuario duplicados sin distinguir mayúsculas. Corregilos antes de aplicar esta migración.';
  END IF;
END
$migration$;

CREATE UNIQUE INDEX perfiles_nombre_usuario_login_uidx
  ON public.perfiles (nombre_usuario_login);
