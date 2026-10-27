-- Permite cargar equipos de ejemplo antes de que existan cuentas de capitanes.
ALTER TABLE public.equipos
  ALTER COLUMN capitan_id DROP NOT NULL;
