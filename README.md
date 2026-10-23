# D10S Cup

Plataforma web para organizar torneos de fútbol. Incluye tienda de entradas e indumentaria, gestión de torneos y equipos, fixture, resultados y autenticación.

## Sitio

[Abrir D10S Cup](https://d1os-cup.vercel.app/)

## Tecnologías

- HTML, CSS y JavaScript nativo
- Supabase para autenticación, base de datos y operaciones de tienda
- Vercel para el deploy estático

## Desarrollo local

No requiere instalar dependencias. Desde la raíz del proyecto, ejecutar:

```bash
npm run dev
```

Luego abrir <http://localhost:8000>.

## Estructura

```text
CSS/                 Estilos
HTML/                Páginas del sitio
JS/                  Lógica del cliente e integración con Supabase
assets/              Imágenes del sitio
docs/                Guía de usuario y notas técnicas
supabase/            Migraciones y datos iniciales de la base
index.html           Página principal
vercel.json          Configuración del deploy
```

## Supabase

La URL del proyecto y la clave publicable se configuran en `JS/supabaseClient.js`. La clave publicable está diseñada para usarse en el navegador; los permisos de acceso deben protegerse con políticas RLS. Nunca incluir una clave `service_role` en el frontend.

Las migraciones y el seed de la base están en `supabase/`. Para configurar los enlaces de autenticación, agregar los dominios de producción y preview en **Authentication → URL Configuration → Redirect URLs**.

### Inicio con nombre de usuario

El inicio de sesión por nombre de usuario usa la función `api/username-login.js`; el correo sigue autenticándose directamente con Supabase. Configurá estas variables en **Vercel → Settings → Environment Variables** para producción y previews:

| Variable | Valor |
| --- | --- |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | Clave publicable de Supabase |
| `SUPABASE_SECRET_KEY` | Clave `sb_secret_…` de Supabase. También acepta la clave heredada `SUPABASE_SERVICE_ROLE_KEY`. |

La clave de servidor solo se usa dentro de la función de Vercel. No agregarla al código del navegador ni al repositorio. Aplicar primero la migración `login_por_nombre_usuario` para normalizar y hacer únicos los nombres de usuario.

### Cuenta administradora

Creá y confirmá la cuenta desde el registro normal del sitio. Después, en Supabase SQL Editor, reemplazá el correo de ejemplo en [`supabase/operations/promover_admin.sql`](supabase/operations/promover_admin.sql) por el correo de esa cuenta y ejecutá el script. El rol y las políticas RLS existentes habilitan las operaciones administrativas permitidas por la base de datos.

## Documentación

- [Guía de usuario](docs/GUIA_USUARIO.md)
- [Notas de integración con Supabase](docs/CAMBIOS_SUPABASE.md)

Cada push a `main` genera un nuevo deploy en Vercel.
