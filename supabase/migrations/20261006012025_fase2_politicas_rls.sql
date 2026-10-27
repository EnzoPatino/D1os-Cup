
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON SEQUENCES FROM anon, authenticated;

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public
  FROM PUBLIC, anon, authenticated;

ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.torneos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupo_equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_partido ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variantes_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes_contacto ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.mensajes_contacto
  ADD CONSTRAINT mensajes_contacto_nombre_largo_check
  CHECK (char_length(btrim(nombre)) BETWEEN 1 AND 120);
ALTER TABLE public.mensajes_contacto
  ADD CONSTRAINT mensajes_contacto_email_largo_check
  CHECK (char_length(btrim(email)) BETWEEN 1 AND 254);
ALTER TABLE public.mensajes_contacto
  ADD CONSTRAINT mensajes_contacto_telefono_largo_check
  CHECK (telefono IS NULL OR char_length(btrim(telefono)) <= 40);
ALTER TABLE public.mensajes_contacto
  ADD CONSTRAINT mensajes_contacto_mensaje_largo_check
  CHECK (char_length(btrim(mensaje)) BETWEEN 1 AND 5000);

CREATE FUNCTION private.es_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.perfiles AS p
    WHERE p.id = (SELECT auth.uid())
      AND p.rol = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION private.es_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.es_admin() TO authenticated;

CREATE FUNCTION private.proteger_campos_equipo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF OLD.capitan_id = (SELECT auth.uid())
     AND NOT (SELECT private.es_admin())
     AND (
       NEW.id IS DISTINCT FROM OLD.id
       OR NEW.capitan_id IS DISTINCT FROM OLD.capitan_id
       OR NEW.created_at IS DISTINCT FROM OLD.created_at
     ) THEN
    RAISE EXCEPTION 'El capitán solo puede modificar el nombre y el logo del equipo'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.proteger_campos_equipo() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER proteger_campos_equipo
BEFORE UPDATE ON public.equipos
FOR EACH ROW EXECUTE FUNCTION private.proteger_campos_equipo();

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable()
  FROM PUBLIC, anon, authenticated;

ALTER FUNCTION public.crear_equipo(text, text) SET SCHEMA private;
ALTER FUNCTION private.crear_equipo(text, text) RENAME TO crear_equipo_impl;
ALTER FUNCTION public.crear_pedido(jsonb) SET SCHEMA private;
ALTER FUNCTION private.crear_pedido(jsonb) RENAME TO crear_pedido_impl;
ALTER FUNCTION public.confirmar_pago_simulado(uuid) SET SCHEMA private;
ALTER FUNCTION private.confirmar_pago_simulado(uuid)
  RENAME TO confirmar_pago_simulado_impl;
ALTER FUNCTION public.cancelar_pedido(uuid) SET SCHEMA private;
ALTER FUNCTION private.cancelar_pedido(uuid) RENAME TO cancelar_pedido_impl;

REVOKE ALL ON FUNCTION private.crear_equipo_impl(text, text)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.crear_pedido_impl(jsonb)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.confirmar_pago_simulado_impl(uuid)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.cancelar_pedido_impl(uuid)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION private.crear_equipo_impl(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION private.crear_pedido_impl(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION private.confirmar_pago_simulado_impl(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.cancelar_pedido_impl(uuid) TO authenticated;

CREATE FUNCTION public.crear_equipo(p_nombre text, p_logo_url text DEFAULT NULL)
RETURNS uuid
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT private.crear_equipo_impl(p_nombre, p_logo_url);
$$;

CREATE FUNCTION public.crear_pedido(p_items jsonb)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT private.crear_pedido_impl(p_items);
$$;

CREATE FUNCTION public.confirmar_pago_simulado(p_pedido_id uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT private.confirmar_pago_simulado_impl(p_pedido_id);
$$;

CREATE FUNCTION public.cancelar_pedido(p_pedido_id uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT private.cancelar_pedido_impl(p_pedido_id);
$$;

REVOKE ALL ON FUNCTION public.crear_equipo(text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.crear_pedido(jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.confirmar_pago_simulado(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cancelar_pedido(uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.crear_equipo(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crear_pedido(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirmar_pago_simulado(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancelar_pedido(uuid) TO authenticated;

GRANT SELECT ON TABLE
  public.torneos,
  public.grupos,
  public.grupo_equipos,
  public.partidos,
  public.eventos_partido,
  public.categorias_producto,
  public.equipos,
  public.inscripciones,
  public.productos,
  public.variantes_producto,
  public.tabla_posiciones
TO anon;

GRANT INSERT ON TABLE public.mensajes_contacto TO anon;

GRANT SELECT ON TABLE
  public.torneos,
  public.grupos,
  public.grupo_equipos,
  public.partidos,
  public.eventos_partido,
  public.categorias_producto,
  public.equipos,
  public.inscripciones,
  public.productos,
  public.variantes_producto,
  public.tabla_posiciones
TO authenticated;

GRANT SELECT ON TABLE public.perfiles TO authenticated;
GRANT UPDATE (nombre_usuario) ON TABLE public.perfiles TO authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.equipos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.jugadores TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.torneos,
  public.grupos,
  public.grupo_equipos,
  public.partidos,
  public.eventos_partido,
  public.categorias_producto,
  public.productos,
  public.variantes_producto,
  public.inscripciones
TO authenticated;

GRANT SELECT ON TABLE
  public.pedidos,
  public.pedido_items,
  public.pagos
TO authenticated;

GRANT SELECT ON TABLE public.tickets TO authenticated;
GRANT UPDATE (estado, usado_at) ON TABLE public.tickets TO authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE public.mensajes_contacto TO authenticated;

DO $policies$
DECLARE
  v_tabla text;
BEGIN
  FOREACH v_tabla IN ARRAY ARRAY[
    'torneos',
    'grupos',
    'grupo_equipos',
    'partidos',
    'eventos_partido',
    'categorias_producto',
    'equipos'
  ]
  LOOP
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO anon USING (true)',
      v_tabla || '_select_anon',
      v_tabla
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (true)',
      v_tabla || '_select_authenticated',
      v_tabla
    );
  END LOOP;
END
$policies$;

DO $policies$
DECLARE
  v_tabla text;
BEGIN
  FOREACH v_tabla IN ARRAY ARRAY[
    'torneos',
    'grupos',
    'grupo_equipos',
    'partidos',
    'eventos_partido',
    'categorias_producto',
    'productos',
    'variantes_producto',
    'jugadores',
    'inscripciones'
  ]
  LOOP
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING ((SELECT private.es_admin()))',
      v_tabla || '_select_admin',
      v_tabla
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK ((SELECT private.es_admin()))',
      v_tabla || '_insert_admin',
      v_tabla
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING ((SELECT private.es_admin())) WITH CHECK ((SELECT private.es_admin()))',
      v_tabla || '_update_admin',
      v_tabla
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING ((SELECT private.es_admin()))',
      v_tabla || '_delete_admin',
      v_tabla
    );
  END LOOP;
END
$policies$;

CREATE POLICY perfiles_select_propio
ON public.perfiles FOR SELECT TO authenticated
USING (id = (SELECT auth.uid()));

CREATE POLICY perfiles_select_admin
ON public.perfiles FOR SELECT TO authenticated
USING ((SELECT private.es_admin()));

CREATE POLICY perfiles_update_propio
ON public.perfiles FOR UPDATE TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY perfiles_update_admin
ON public.perfiles FOR UPDATE TO authenticated
USING ((SELECT private.es_admin()))
WITH CHECK ((SELECT private.es_admin()));

CREATE POLICY equipos_update_capitan
ON public.equipos FOR UPDATE TO authenticated
USING (capitan_id = (SELECT auth.uid()))
WITH CHECK (capitan_id = (SELECT auth.uid()));

CREATE POLICY equipos_update_admin
ON public.equipos FOR UPDATE TO authenticated
USING ((SELECT private.es_admin()))
WITH CHECK ((SELECT private.es_admin()));

CREATE POLICY equipos_delete_admin
ON public.equipos FOR DELETE TO authenticated
USING ((SELECT private.es_admin()));

CREATE POLICY jugadores_select_capitan
ON public.jugadores FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.equipos AS e
    WHERE e.id = jugadores.equipo_id
      AND e.capitan_id = (SELECT auth.uid())
  )
);

CREATE POLICY jugadores_insert_capitan
ON public.jugadores FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.equipos AS e
    WHERE e.id = jugadores.equipo_id
      AND e.capitan_id = (SELECT auth.uid())
  )
);

CREATE POLICY jugadores_update_capitan
ON public.jugadores FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.equipos AS e
    WHERE e.id = jugadores.equipo_id
      AND e.capitan_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.equipos AS e
    WHERE e.id = jugadores.equipo_id
      AND e.capitan_id = (SELECT auth.uid())
  )
);

CREATE POLICY jugadores_delete_capitan
ON public.jugadores FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.equipos AS e
    WHERE e.id = jugadores.equipo_id
      AND e.capitan_id = (SELECT auth.uid())
  )
);

CREATE POLICY inscripciones_select_aprobadas_anon
ON public.inscripciones FOR SELECT TO anon
USING (estado = 'aprobada');

CREATE POLICY inscripciones_select_aprobadas_authenticated
ON public.inscripciones FOR SELECT TO authenticated
USING (estado = 'aprobada');

CREATE POLICY inscripciones_select_propio_capitan
ON public.inscripciones FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.equipos AS e
    WHERE e.id = inscripciones.equipo_id
      AND e.capitan_id = (SELECT auth.uid())
  )
);

CREATE POLICY inscripciones_insert_capitan
ON public.inscripciones FOR INSERT TO authenticated
WITH CHECK (
  estado = 'pendiente'
  AND EXISTS (
    SELECT 1 FROM public.equipos AS e
    WHERE e.id = inscripciones.equipo_id
      AND e.capitan_id = (SELECT auth.uid())
  )
  AND EXISTS (
    SELECT 1 FROM public.torneos AS t
    WHERE t.id = inscripciones.torneo_id
      AND t.estado = 'inscripciones_abiertas'
  )
);

CREATE POLICY productos_select_activos_anon
ON public.productos FOR SELECT TO anon
USING (activo = true);

CREATE POLICY productos_select_activos_authenticated
ON public.productos FOR SELECT TO authenticated
USING (activo = true);

CREATE POLICY variantes_select_productos_activos_anon
ON public.variantes_producto FOR SELECT TO anon
USING (
  EXISTS (
    SELECT 1 FROM public.productos AS p
    WHERE p.id = variantes_producto.producto_id
      AND p.activo = true
  )
);

CREATE POLICY variantes_select_productos_activos_authenticated
ON public.variantes_producto FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.productos AS p
    WHERE p.id = variantes_producto.producto_id
      AND p.activo = true
  )
);

CREATE POLICY pedidos_select_propio
ON public.pedidos FOR SELECT TO authenticated
USING (usuario_id = (SELECT auth.uid()));

CREATE POLICY pedidos_select_admin
ON public.pedidos FOR SELECT TO authenticated
USING ((SELECT private.es_admin()));

CREATE POLICY pedido_items_select_propio
ON public.pedido_items FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pedidos AS p
    WHERE p.id = pedido_items.pedido_id
      AND p.usuario_id = (SELECT auth.uid())
  )
);

CREATE POLICY pedido_items_select_admin
ON public.pedido_items FOR SELECT TO authenticated
USING ((SELECT private.es_admin()));

CREATE POLICY pagos_select_propio
ON public.pagos FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pedidos AS p
    WHERE p.id = pagos.pedido_id
      AND p.usuario_id = (SELECT auth.uid())
  )
);

CREATE POLICY pagos_select_admin
ON public.pagos FOR SELECT TO authenticated
USING ((SELECT private.es_admin()));

CREATE POLICY tickets_select_propio
ON public.tickets FOR SELECT TO authenticated
USING (usuario_id = (SELECT auth.uid()));

CREATE POLICY tickets_select_admin
ON public.tickets FOR SELECT TO authenticated
USING ((SELECT private.es_admin()));

CREATE POLICY tickets_update_admin
ON public.tickets FOR UPDATE TO authenticated
USING ((SELECT private.es_admin()))
WITH CHECK ((SELECT private.es_admin()));

CREATE POLICY mensajes_contacto_insert_anon
ON public.mensajes_contacto FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY mensajes_contacto_insert_authenticated
ON public.mensajes_contacto FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY mensajes_contacto_select_admin
ON public.mensajes_contacto FOR SELECT TO authenticated
USING ((SELECT private.es_admin()));

CREATE POLICY mensajes_contacto_delete_admin
ON public.mensajes_contacto FOR DELETE TO authenticated
USING ((SELECT private.es_admin()));
