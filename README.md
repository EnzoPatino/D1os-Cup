# D10S Cup

Sitio web para consultar torneos, partidos, resultados y la tienda de D10S Cup.

**Sitio publicado:** [d1os-cup.vercel.app](https://d1os-cup.vercel.app/)

## Por dónde empezar

- [Índice de documentación](docs/README.md)
- [Manual de usuario](docs/manual/guia_usuario.md)
- [Presupuesto vigente](docs/presupuesto/presupuesto.md) · [PDF](docs/presupuesto/presupuesto.pdf)
- [Notas técnicas de Supabase](docs/tecnica/supabase.md)
- [Plan de pruebas](docs/entrega/plan_de_pruebas.md)
- [Guion de exposición y demo](docs/entrega/exposicion_y_demo.md)

## Desarrollo local

No requiere instalar dependencias. Desde la raíz del proyecto, ejecutá:

```bash
npm run dev
```

Abrí <http://localhost:8000>.

## Estructura del proyecto

```text
CSS/                 Estilos
HTML/                Páginas del sitio
JS/                  Lógica del cliente e integración con Supabase
api/                 Funciones de Vercel para autenticación por usuario
assets/              Imágenes utilizadas por el sitio
docs/                Manual, presupuesto, entregas y notas técnicas
supabase/            Migraciones y datos iniciales de la base
index.html           Portada
vercel.json          Configuración de Vercel
```

## Supabase y publicación

La URL del proyecto y la clave publicable están en `JS/supabaseClient.js`. Esa clave se usa desde el navegador; nunca incluyas una clave secreta o `service_role` en archivos públicos.

El inicio de sesión admite correo y nombre de usuario. Para el nombre, el sitio consulta la función SQL `email_para_nombre_usuario` y después autentica con Supabase Auth. La función está definida en `supabase/migrations/20261025120000_login_por_nombre_rpc.sql`; aplicá las migraciones de `supabase/migrations/` en orden en el proyecto Supabase antes de publicar cambios de base de datos. El acceso por nombre no necesita una clave secreta de servidor en Vercel.

Las políticas RLS limitan las operaciones sobre la base. Para promover una cuenta existente, revisá `supabase/operations/promover_admin.sql` y ejecutalo desde SQL Editor con el correo correcto. El rol concedido depende de las políticas y operaciones implementadas; el índice de documentación explica el alcance actual.

Cada push a `main` inicia el deploy configurado en Vercel.
