# Manual de usuario

Guía rápida para usar el sitio de D10S Cup. La disponibilidad de datos depende de lo cargado en la base y de la conexión.

## Secciones

- **Inicio:** portada y accesos a las secciones.
- **Torneos:** listado, búsqueda y filtros por modalidad. Si la cuenta tiene permisos administrativos, también aparece la opción para crear un torneo.
- **Partidos:** consulta de partidos programados y calendario mensual.
- **Resultados:** tablas de grupos y fase eliminatoria cuando hay datos disponibles.
- **Tienda:** catálogo de entradas e indumentaria, búsqueda, filtros y carrito.
- **Mis compras y entradas:** historial de pedidos de la cuenta y tickets disponibles.

En las páginas internas, la barra lateral permite moverse entre las secciones. En pantallas angostas se abre con el botón de menú.

## Crear una cuenta

1. Elegí **Registrarse**.
2. Completá nombre de usuario, correo y contraseña.
3. Revisá el correo y confirmá la cuenta si Supabase solicita confirmación.
4. Volvé a **Iniciar sesión**.

## Iniciar sesión

Podés ingresar con tu correo o con tu nombre de usuario, junto con la contraseña de la cuenta. El nombre de usuario se busca en la base y se usa para resolver el correo asociado antes de autenticar. Si el acceso por nombre falla, verificá que la migración `20261025120000_login_por_nombre_rpc.sql` esté aplicada en Supabase.

Para cerrar la sesión, abrí el menú de usuario y elegí **Cerrar sesión**. Para recuperar el acceso, usá **¿Olvidaste tu contraseña?** e ingresá el correo registrado.

## Consultar el torneo

En **Torneos**, buscá por nombre o filtrá por fútbol 11, fútbol 8 o fútbol 5. **Partidos** muestra los encuentros disponibles; **Resultados** presenta la información cargada de grupos y eliminatorias. Si una sección no tiene datos, puede aparecer vacía o mostrar un mensaje de estado.

## Usar la tienda

1. Entrá a **Tienda** y buscá un producto o elegí una categoría.
2. Seleccioná la variante disponible, si corresponde.
3. Agregá el producto al carrito y revisá cantidades y total.
4. Iniciá sesión y finalizá el pedido siguiendo los pasos en pantalla.
5. Consultá el estado del pedido y los tickets desde **Mis compras y entradas**.

El flujo de pago disponible es de demostración: no procesa una transacción real. El QR identifica un ticket emitido por la aplicación; no reemplaza un sistema de validación en puerta.

## Privacidad y ayuda

Cada usuario consulta sus propias compras. No compartas tu contraseña ni enlaces de recuperación. Si el catálogo o los datos no cargan, comprobá la conexión y volvé a intentar más tarde.
