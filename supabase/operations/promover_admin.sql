-- En Supabase SQL Editor, reemplazá el correo de ejemplo por el correo exacto
-- de una cuenta ya creada y confirmada. Revisá que RETURNING devuelva una fila.
UPDATE public.perfiles
SET rol = 'admin'::public.rol_usuario
WHERE lower(email) = lower(btrim('REEMPLAZAR_POR_EL_CORREO_ADMIN'))
RETURNING id, nombre_usuario, email, rol;
