# Supabase: configuración y funcionamiento

Referencia operativa del sitio. El esquema, los permisos y las operaciones están definidos en `supabase/migrations/`.

## Arquitectura

El frontend usa HTML, CSS y JavaScript; Supabase provee autenticación, PostgreSQL y la API de datos. Vercel publica las páginas y las funciones ubicadas en `api/`.

La URL y la clave publicable del proyecto están en `JS/supabaseClient.js`. La clave publicable puede aparecer en el navegador. No publiques claves secretas ni `service_role`; el acceso a la base debe quedar protegido por RLS.

## Preparar la base

Aplicá los archivos SQL pendientes de `supabase/migrations/` en orden cronológico. Las migraciones cubren el esquema, políticas RLS, equipos y acceso por nombre de usuario. El seed de datos de ejemplo está en `supabase/seed.sql`.

Para el login con nombre de usuario deben estar aplicadas:

1. `20261023185603_login_por_nombre_usuario.sql`, que normaliza los nombres para búsqueda.
2. `20261025120000_login_por_nombre_rpc.sql`, que crea `email_para_nombre_usuario`.

El cliente llama a esa función desde `JS/inicioSesion.js` y luego autentica con Supabase Auth. El login por correo usa `api/email-login.js`. La API heredada `api/username-login.js` ya no participa en el formulario actual.

En **Authentication → URL Configuration**, agregá el dominio publicado y las direcciones locales que uses para confirmar y recuperar cuentas.

## Datos y permisos

Las tablas agrupan perfiles y equipos; torneos, inscripciones, grupos y partidos; productos, variantes y pedidos; y mensajes de contacto. `tabla_posiciones` calcula estadísticas desde los partidos de grupo jugados.

RLS limita las lecturas y escrituras según sesión, propiedad y rol. El cliente no puede cambiar su propio rol. Las operaciones de compra se realizan con funciones RPC que validan variante, stock y precio en la base. El pago está simulado: no se cobra dinero ni se verifica una transacción externa.

El panel administrativo es limitado. En la interfaz actual, la acción administrativa disponible es crear torneos; no hay un panel general para gestionar todas las tablas.

## Promover una cuenta

Para dar el rol `admin` a una cuenta ya creada, revisá `supabase/operations/promover_admin.sql`, reemplazá el correo de ejemplo y ejecutalo desde **SQL Editor**. Verificá cuidadosamente el correo antes de ejecutar el cambio.

## Desarrollo local

Desde la raíz del repositorio, ejecutá `npm run dev` y abrí <http://localhost:8000>. No abras las páginas con `file://`: los módulos JavaScript necesitan un servidor HTTP.

## Referencias

- [Migraciones SQL](../../supabase/migrations/)
- [Seed de datos](../../supabase/seed.sql)
- [Operación para promover administrador](../../supabase/operations/promover_admin.sql)
- [Historial técnico anterior](../archivo/historial_cambios_supabase.md)
