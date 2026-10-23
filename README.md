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

## Documentación

- [Guía de usuario](docs/GUIA_USUARIO.md)
- [Notas de integración con Supabase](docs/CAMBIOS_SUPABASE.md)

Cada push a `main` genera un nuevo deploy en Vercel.
