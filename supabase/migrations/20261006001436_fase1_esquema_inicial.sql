
CREATE TYPE public.rol_usuario AS ENUM ('admin', 'equipo', 'aficionado');
CREATE TYPE public.modalidad_torneo AS ENUM ('futbol_11', 'futbol_8', 'futbol_5');
CREATE TYPE public.estado_torneo AS ENUM ('inscripciones_abiertas', 'en_curso', 'finalizado');
CREATE TYPE public.estado_inscripcion AS ENUM ('pendiente', 'aprobada', 'rechazada');
CREATE TYPE public.fase_partido AS ENUM ('grupos', 'cuartos', 'semifinal', 'final');
CREATE TYPE public.estado_partido AS ENUM ('programado', 'jugado');
CREATE TYPE public.tipo_evento_partido AS ENUM ('gol', 'amarilla', 'roja', 'asistencia');
CREATE TYPE public.estado_pedido AS ENUM ('pendiente_pago', 'pagado', 'cancelado', 'reembolsado');
CREATE TYPE public.metodo_pago AS ENUM ('simulado');
CREATE TYPE public.estado_pago AS ENUM ('pendiente', 'aprobado', 'rechazado', 'cancelado', 'reembolsado');
CREATE TYPE public.estado_ticket AS ENUM ('valido', 'usado', 'anulado');

CREATE TABLE public.perfiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_usuario text NOT NULL,
  email text NOT NULL UNIQUE,
  rol public.rol_usuario NOT NULL DEFAULT 'aficionado',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.equipos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  capitan_id uuid NOT NULL REFERENCES public.perfiles(id) ON DELETE RESTRICT,
  nombre text NOT NULL,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.jugadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipo_id uuid NOT NULL REFERENCES public.equipos(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  apellido text NOT NULL,
  dni text NOT NULL,
  numero_camiseta smallint CHECK (numero_camiseta BETWEEN 1 AND 99),
  fecha_nacimiento date,
  ficha_medica_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (equipo_id, dni)
);

CREATE TABLE public.torneos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  modalidad public.modalidad_torneo NOT NULL,
  estado public.estado_torneo NOT NULL DEFAULT 'inscripciones_abiertas',
  fecha_inicio date,
  cupo_equipos integer NOT NULL CHECK (cupo_equipos > 0),
  premio text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.inscripciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  torneo_id uuid NOT NULL REFERENCES public.torneos(id) ON DELETE CASCADE,
  equipo_id uuid NOT NULL REFERENCES public.equipos(id) ON DELETE RESTRICT,
  estado public.estado_inscripcion NOT NULL DEFAULT 'pendiente',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (torneo_id, equipo_id)
);

CREATE TABLE public.grupos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  torneo_id uuid NOT NULL REFERENCES public.torneos(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (torneo_id, nombre)
);

CREATE TABLE public.grupo_equipos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grupo_id uuid NOT NULL REFERENCES public.grupos(id) ON DELETE CASCADE,
  equipo_id uuid NOT NULL REFERENCES public.equipos(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (grupo_id, equipo_id)
);

CREATE TABLE public.partidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  torneo_id uuid NOT NULL REFERENCES public.torneos(id) ON DELETE CASCADE,
  fase public.fase_partido NOT NULL,
  grupo_id uuid REFERENCES public.grupos(id) ON DELETE SET NULL,
  equipo_local_id uuid REFERENCES public.equipos(id) ON DELETE RESTRICT,
  equipo_visitante_id uuid REFERENCES public.equipos(id) ON DELETE RESTRICT,
  fecha_hora timestamptz,
  cancha text,
  estadio text,
  estado public.estado_partido NOT NULL DEFAULT 'programado',
  goles_local integer,
  goles_visitante integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (fase <> 'grupos' OR grupo_id IS NOT NULL),
  CHECK (
    equipo_local_id IS NULL OR equipo_visitante_id IS NULL
    OR equipo_local_id <> equipo_visitante_id
  ),
  CHECK (
    (estado = 'programado' AND goles_local IS NULL AND goles_visitante IS NULL)
    OR
    (estado = 'jugado' AND goles_local >= 0 AND goles_visitante >= 0)
  )
);

CREATE TABLE public.eventos_partido (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partido_id uuid NOT NULL REFERENCES public.partidos(id) ON DELETE CASCADE,
  equipo_id uuid NOT NULL REFERENCES public.equipos(id) ON DELETE RESTRICT,
  jugador_id uuid REFERENCES public.jugadores(id) ON DELETE SET NULL,
  tipo public.tipo_evento_partido NOT NULL,
  minuto smallint CHECK (minuto BETWEEN 0 AND 150),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.categorias_producto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE
    CHECK (nombre IN ('entradas', 'camisetas', 'shorts', 'accesorios')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id uuid NOT NULL REFERENCES public.categorias_producto(id) ON DELETE RESTRICT,
  nombre text NOT NULL,
  descripcion text,
  precio numeric(12,2) NOT NULL CHECK (precio >= 0),
  imagen_url text,
  activo boolean NOT NULL DEFAULT true,
  partido_id uuid REFERENCES public.partidos(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.variantes_producto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  etiqueta text NOT NULL,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (producto_id, etiqueta)
);

CREATE TABLE public.pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES public.perfiles(id) ON DELETE RESTRICT,
  total numeric(12,2) NOT NULL CHECK (total >= 0),
  estado public.estado_pedido NOT NULL DEFAULT 'pendiente_pago',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.pedido_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES public.pedidos(id) ON DELETE RESTRICT,
  variante_id uuid NOT NULL REFERENCES public.variantes_producto(id) ON DELETE RESTRICT,
  cantidad integer NOT NULL CHECK (cantidad > 0),
  precio_unitario numeric(12,2) NOT NULL CHECK (precio_unitario >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (pedido_id, variante_id)
);

CREATE TABLE public.pagos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES public.pedidos(id) ON DELETE RESTRICT,
  metodo public.metodo_pago NOT NULL DEFAULT 'simulado',
  estado public.estado_pago NOT NULL DEFAULT 'pendiente',
  referencia_externa text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_item_id uuid NOT NULL REFERENCES public.pedido_items(id) ON DELETE RESTRICT,
  usuario_id uuid NOT NULL REFERENCES public.perfiles(id) ON DELETE RESTRICT,
  partido_id uuid NOT NULL REFERENCES public.partidos(id) ON DELETE RESTRICT,
  codigo uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  estado public.estado_ticket NOT NULL DEFAULT 'valido',
  usado_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mensajes_contacto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  mensaje text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX equipos_capitan_id_idx ON public.equipos(capitan_id);
CREATE INDEX jugadores_equipo_id_idx ON public.jugadores(equipo_id);
CREATE INDEX inscripciones_equipo_id_idx ON public.inscripciones(equipo_id);
CREATE INDEX inscripciones_torneo_estado_idx ON public.inscripciones(torneo_id, estado);
CREATE INDEX grupos_torneo_id_idx ON public.grupos(torneo_id);
CREATE INDEX grupo_equipos_equipo_id_idx ON public.grupo_equipos(equipo_id);
CREATE INDEX partidos_torneo_fecha_idx ON public.partidos(torneo_id, fecha_hora);
CREATE INDEX partidos_grupo_id_idx ON public.partidos(grupo_id);
CREATE INDEX partidos_equipo_local_idx ON public.partidos(equipo_local_id);
CREATE INDEX partidos_equipo_visitante_idx ON public.partidos(equipo_visitante_id);
CREATE INDEX partidos_estado_fecha_idx ON public.partidos(estado, fecha_hora);
CREATE INDEX eventos_partido_id_idx ON public.eventos_partido(partido_id);
CREATE INDEX eventos_equipo_id_idx ON public.eventos_partido(equipo_id);
CREATE INDEX eventos_jugador_id_idx ON public.eventos_partido(jugador_id);
CREATE INDEX productos_categoria_activo_idx ON public.productos(categoria_id, activo);
CREATE INDEX productos_partido_id_idx ON public.productos(partido_id);
CREATE INDEX variantes_producto_id_idx ON public.variantes_producto(producto_id);
CREATE INDEX pedidos_usuario_fecha_idx ON public.pedidos(usuario_id, created_at DESC);
CREATE INDEX pedido_items_variante_id_idx ON public.pedido_items(variante_id);
CREATE INDEX pagos_pedido_id_idx ON public.pagos(pedido_id);
CREATE INDEX tickets_usuario_estado_idx ON public.tickets(usuario_id, estado);
CREATE INDEX tickets_partido_id_idx ON public.tickets(partido_id);
CREATE INDEX tickets_pedido_item_id_idx ON public.tickets(pedido_item_id);

CREATE VIEW public.tabla_posiciones WITH (security_invoker = true) AS
WITH apariciones AS (
  SELECT
    p.grupo_id,
    p.equipo_local_id AS equipo_id,
    p.goles_local AS gf,
    p.goles_visitante AS gc,
    CASE
      WHEN p.goles_local > p.goles_visitante THEN 1
      WHEN p.goles_local = p.goles_visitante THEN 0
      ELSE -1
    END AS resultado
  FROM public.partidos AS p
  WHERE p.fase = 'grupos' AND p.estado = 'jugado' AND p.grupo_id IS NOT NULL
  UNION ALL
  SELECT
    p.grupo_id,
    p.equipo_visitante_id,
    p.goles_visitante,
    p.goles_local,
    CASE
      WHEN p.goles_visitante > p.goles_local THEN 1
      WHEN p.goles_visitante = p.goles_local THEN 0
      ELSE -1
    END
  FROM public.partidos AS p
  WHERE p.fase = 'grupos' AND p.estado = 'jugado' AND p.grupo_id IS NOT NULL
),
acumulado AS (
  SELECT
    grupo_id,
    equipo_id,
    count(*)::integer AS pj,
    count(*) FILTER (WHERE resultado = 1)::integer AS g,
    count(*) FILTER (WHERE resultado = 0)::integer AS e,
    count(*) FILTER (WHERE resultado = -1)::integer AS p,
    sum(gf)::integer AS gf,
    sum(gc)::integer AS gc
  FROM apariciones
  GROUP BY grupo_id, equipo_id
)
SELECT
  ge.grupo_id,
  ge.equipo_id,
  coalesce(a.pj, 0) AS pj,
  coalesce(a.g, 0) AS g,
  coalesce(a.e, 0) AS e,
  coalesce(a.p, 0) AS p,
  coalesce(a.gf, 0) AS gf,
  coalesce(a.gc, 0) AS gc,
  coalesce(a.gf, 0) - coalesce(a.gc, 0) AS dif,
  3 * coalesce(a.g, 0) + coalesce(a.e, 0) AS pts
FROM public.grupo_equipos AS ge
LEFT JOIN acumulado AS a
  ON a.grupo_id = ge.grupo_id AND a.equipo_id = ge.equipo_id;

CREATE FUNCTION public.crear_perfil_usuario()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre_usuario, email)
  VALUES (
    NEW.id,
    coalesce(
      nullif(pg_catalog.btrim(NEW.raw_user_meta_data ->> 'nombre_usuario'), ''),
      'usuario-' || pg_catalog.substr(NEW.id::text, 1, 8)
    ),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER al_crear_usuario_auth
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.crear_perfil_usuario();

CREATE FUNCTION public.crear_equipo(p_nombre text, p_logo_url text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_usuario_id uuid := auth.uid();
  v_equipo_id uuid;
BEGIN
  IF v_usuario_id IS NULL THEN
    RAISE EXCEPTION 'Debés iniciar sesión para crear un equipo'
      USING ERRCODE = '28000';
  END IF;

  IF nullif(pg_catalog.btrim(p_nombre), '') IS NULL THEN
    RAISE EXCEPTION 'El nombre del equipo es obligatorio';
  END IF;

  UPDATE public.perfiles
  SET rol = CASE
    WHEN rol = 'admin' THEN 'admin'::public.rol_usuario
    ELSE 'equipo'::public.rol_usuario
  END
  WHERE id = v_usuario_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No existe el perfil del usuario autenticado';
  END IF;

  INSERT INTO public.equipos (capitan_id, nombre, logo_url)
  VALUES (v_usuario_id, pg_catalog.btrim(p_nombre), p_logo_url)
  RETURNING id INTO v_equipo_id;

  RETURN v_equipo_id;
END;
$$;

CREATE FUNCTION public.crear_pedido(p_items jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_usuario_id uuid := auth.uid();
  v_pedido_id uuid;
  v_item record;
  v_solicitados integer;
  v_procesados integer := 0;
  v_total numeric(12,2) := 0;
BEGIN
  IF v_usuario_id IS NULL THEN
    RAISE EXCEPTION 'Debés iniciar sesión para crear un pedido'
      USING ERRCODE = '28000';
  END IF;

  IF p_items IS NULL OR pg_catalog.jsonb_typeof(p_items) <> 'array' THEN
    RAISE EXCEPTION 'Los artículos deben enviarse como una lista';
  END IF;

  IF pg_catalog.jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'El pedido no puede estar vacío';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_catalog.jsonb_to_recordset(p_items)
      AS x(variante_id uuid, cantidad integer)
    WHERE x.variante_id IS NULL OR x.cantidad IS NULL OR x.cantidad <= 0
  ) THEN
    RAISE EXCEPTION 'Cada artículo requiere una variante y una cantidad positiva';
  END IF;

  SELECT count(*)::integer
  INTO v_solicitados
  FROM (
    SELECT x.variante_id
    FROM pg_catalog.jsonb_to_recordset(p_items)
      AS x(variante_id uuid, cantidad integer)
    GROUP BY x.variante_id
  ) AS solicitud;

  FOR v_item IN
    WITH solicitud AS (
      SELECT x.variante_id, sum(x.cantidad)::integer AS cantidad
      FROM pg_catalog.jsonb_to_recordset(p_items)
        AS x(variante_id uuid, cantidad integer)
      GROUP BY x.variante_id
    )
    SELECT
      s.variante_id,
      s.cantidad,
      vp.stock,
      pr.precio,
      pr.activo,
      cp.nombre AS categoria,
      pr.partido_id,
      partido.estado AS estado_partido
    FROM solicitud AS s
    JOIN public.variantes_producto AS vp ON vp.id = s.variante_id
    JOIN public.productos AS pr ON pr.id = vp.producto_id
    JOIN public.categorias_producto AS cp ON cp.id = pr.categoria_id
    LEFT JOIN public.partidos AS partido ON partido.id = pr.partido_id
    ORDER BY s.variante_id
    FOR UPDATE OF vp
  LOOP
    v_procesados := v_procesados + 1;

    IF NOT v_item.activo THEN
      RAISE EXCEPTION 'El producto ya no está disponible';
    END IF;

    IF v_item.stock < v_item.cantidad THEN
      RAISE EXCEPTION 'Stock insuficiente para la variante %', v_item.variante_id;
    END IF;

    IF v_item.categoria = 'entradas'
       AND (v_item.partido_id IS NULL OR v_item.estado_partido = 'jugado') THEN
      RAISE EXCEPTION 'No se pueden comprar entradas para ese partido';
    END IF;

    v_total := v_total + (v_item.precio * v_item.cantidad);

    UPDATE public.variantes_producto
    SET stock = stock - v_item.cantidad
    WHERE id = v_item.variante_id;
  END LOOP;

  IF v_procesados <> v_solicitados THEN
    RAISE EXCEPTION 'Una o más variantes no existen';
  END IF;

  INSERT INTO public.pedidos (usuario_id, total, estado)
  VALUES (v_usuario_id, v_total, 'pendiente_pago')
  RETURNING id INTO v_pedido_id;

  FOR v_item IN
    WITH solicitud AS (
      SELECT x.variante_id, sum(x.cantidad)::integer AS cantidad
      FROM pg_catalog.jsonb_to_recordset(p_items)
        AS x(variante_id uuid, cantidad integer)
      GROUP BY x.variante_id
    )
    SELECT s.variante_id, s.cantidad, pr.precio
    FROM solicitud AS s
    JOIN public.variantes_producto AS vp ON vp.id = s.variante_id
    JOIN public.productos AS pr ON pr.id = vp.producto_id
    ORDER BY s.variante_id
  LOOP
    INSERT INTO public.pedido_items (pedido_id, variante_id, cantidad, precio_unitario)
    VALUES (v_pedido_id, v_item.variante_id, v_item.cantidad, v_item.precio);
  END LOOP;

  INSERT INTO public.pagos (pedido_id, metodo, estado)
  VALUES (v_pedido_id, 'simulado', 'pendiente');

  RETURN pg_catalog.jsonb_build_object(
    'pedido_id', v_pedido_id,
    'total', v_total,
    'estado', 'pendiente_pago'
  );
END;
$$;

CREATE FUNCTION public.confirmar_pago_simulado(p_pedido_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_usuario_id uuid := auth.uid();
  v_estado public.estado_pedido;
  v_filas integer;
  v_item record;
  v_unidad integer;
  v_tickets jsonb;
BEGIN
  IF v_usuario_id IS NULL THEN
    RAISE EXCEPTION 'Debés iniciar sesión para confirmar el pago'
      USING ERRCODE = '28000';
  END IF;

  SELECT estado
  INTO v_estado
  FROM public.pedidos
  WHERE id = p_pedido_id AND usuario_id = v_usuario_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'El pedido no existe o no pertenece al usuario';
  END IF;

  IF v_estado = 'pagado' THEN
    SELECT coalesce(
      pg_catalog.jsonb_agg(
        pg_catalog.jsonb_build_object(
          'codigo', t.codigo,
          'partido_id', t.partido_id,
          'estado', t.estado
        ) ORDER BY t.created_at, t.codigo
      ),
      '[]'::jsonb
    )
    INTO v_tickets
    FROM public.tickets AS t
    JOIN public.pedido_items AS pi ON pi.id = t.pedido_item_id
    WHERE pi.pedido_id = p_pedido_id;

    RETURN pg_catalog.jsonb_build_object(
      'pedido_id', p_pedido_id,
      'estado', 'pagado',
      'tickets', v_tickets
    );
  END IF;

  IF v_estado <> 'pendiente_pago' THEN
    RAISE EXCEPTION 'El pedido no está pendiente de pago';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.pedido_items AS pi
    JOIN public.variantes_producto AS vp ON vp.id = pi.variante_id
    JOIN public.productos AS pr ON pr.id = vp.producto_id
    JOIN public.categorias_producto AS cp ON cp.id = pr.categoria_id
    LEFT JOIN public.partidos AS partido ON partido.id = pr.partido_id
    WHERE pi.pedido_id = p_pedido_id
      AND cp.nombre = 'entradas'
      AND (pr.partido_id IS NULL OR partido.estado = 'jugado')
  ) THEN
    RAISE EXCEPTION 'No se puede confirmar una entrada para un partido ya jugado';
  END IF;

  UPDATE public.pagos
  SET estado = 'aprobado'
  WHERE pedido_id = p_pedido_id AND estado = 'pendiente';

  GET DIAGNOSTICS v_filas = ROW_COUNT;
  IF v_filas <> 1 THEN
    RAISE EXCEPTION 'No se encontró un pago pendiente para el pedido';
  END IF;

  UPDATE public.pedidos
  SET estado = 'pagado'
  WHERE id = p_pedido_id;

  FOR v_item IN
    SELECT pi.id AS pedido_item_id, pi.cantidad, pr.partido_id
    FROM public.pedido_items AS pi
    JOIN public.variantes_producto AS vp ON vp.id = pi.variante_id
    JOIN public.productos AS pr ON pr.id = vp.producto_id
    JOIN public.categorias_producto AS cp ON cp.id = pr.categoria_id
    WHERE pi.pedido_id = p_pedido_id AND cp.nombre = 'entradas'
    ORDER BY pi.id
  LOOP
    FOR v_unidad IN 1..v_item.cantidad LOOP
      INSERT INTO public.tickets (pedido_item_id, usuario_id, partido_id)
      VALUES (v_item.pedido_item_id, v_usuario_id, v_item.partido_id);
    END LOOP;
  END LOOP;

  SELECT coalesce(
    pg_catalog.jsonb_agg(
      pg_catalog.jsonb_build_object(
        'codigo', t.codigo,
        'partido_id', t.partido_id,
        'estado', t.estado
      ) ORDER BY t.created_at, t.codigo
    ),
    '[]'::jsonb
  )
  INTO v_tickets
  FROM public.tickets AS t
  JOIN public.pedido_items AS pi ON pi.id = t.pedido_item_id
  WHERE pi.pedido_id = p_pedido_id;

  RETURN pg_catalog.jsonb_build_object(
    'pedido_id', p_pedido_id,
    'estado', 'pagado',
    'tickets', v_tickets
  );
END;
$$;

CREATE FUNCTION public.cancelar_pedido(p_pedido_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_usuario_id uuid := auth.uid();
  v_estado public.estado_pedido;
  v_filas integer;
  v_item record;
BEGIN
  IF v_usuario_id IS NULL THEN
    RAISE EXCEPTION 'Debés iniciar sesión para cancelar el pedido'
      USING ERRCODE = '28000';
  END IF;

  SELECT estado
  INTO v_estado
  FROM public.pedidos
  WHERE id = p_pedido_id AND usuario_id = v_usuario_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'El pedido no existe o no pertenece al usuario';
  END IF;

  IF v_estado = 'cancelado' THEN
    RETURN pg_catalog.jsonb_build_object(
      'pedido_id', p_pedido_id,
      'estado', 'cancelado'
    );
  END IF;

  IF v_estado <> 'pendiente_pago' THEN
    RAISE EXCEPTION 'Solo se pueden cancelar pedidos pendientes de pago';
  END IF;

  FOR v_item IN
    SELECT variante_id, cantidad
    FROM public.pedido_items
    WHERE pedido_id = p_pedido_id
    ORDER BY variante_id
  LOOP
    UPDATE public.variantes_producto
    SET stock = stock + v_item.cantidad
    WHERE id = v_item.variante_id;
  END LOOP;

  UPDATE public.pagos
  SET estado = 'cancelado'
  WHERE pedido_id = p_pedido_id AND estado = 'pendiente';

  GET DIAGNOSTICS v_filas = ROW_COUNT;
  IF v_filas <> 1 THEN
    RAISE EXCEPTION 'No se encontró un pago pendiente para el pedido';
  END IF;

  UPDATE public.pedidos
  SET estado = 'cancelado'
  WHERE id = p_pedido_id;

  RETURN pg_catalog.jsonb_build_object(
    'pedido_id', p_pedido_id,
    'estado', 'cancelado'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.crear_perfil_usuario() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.crear_equipo(text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.crear_pedido(jsonb) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.confirmar_pago_simulado(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cancelar_pedido(uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.crear_equipo(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crear_pedido(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirmar_pago_simulado(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancelar_pedido(uuid) TO authenticated;

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
