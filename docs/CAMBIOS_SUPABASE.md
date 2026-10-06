# Cambios de backend con Supabase

## 1. Resumen

La documentación del proyecto planteaba persistencia, cuentas de usuario, administración del torneo y compras. El sitio original era estático: varias pantallas dibujaban datos fijos en JavaScript y el inicio de sesión y el carrito eran simulaciones. Se conectó el frontend existente a Supabase para guardar y consultar esos datos sin agregar un framework ni un servidor propio.

La base de datos centraliza los torneos, partidos, equipos, productos y compras. Supabase Auth gestiona las cuentas. Las políticas RLS deciden qué filas puede consultar o cambiar cada visitante, usuario, capitán o administrador.

## 2. Arquitectura

```text
Navegador (HTML + CSS + JavaScript vanilla)
             │
             └── supabase-js v2 por CDN
                    ├── Auth: registro, sesión y recuperación
                    ├── Postgres: consultas protegidas por RLS
                    └── RPC: operaciones de compra y creación de equipo
```

Supabase se eligió en lugar del MySQL previsto inicialmente porque reúne Postgres administrado, autenticación, API de datos y políticas de seguridad en un servicio conectado directamente desde un sitio estático. No hace falta programar un servidor para exponer endpoints básicos. Postgres también permite calcular posiciones con una vista y realizar la reserva de stock y la creación de pedidos dentro de transacciones.

El frontend sigue siendo estático. Se sirve, por ejemplo, con Live Server en el puerto 5500; no hay framework, bundler ni servidor de aplicación propio. La URL del proyecto y una clave `publishable` están en `JS/supabaseClient.js`. La clave `publishable` puede estar en el navegador; la seguridad depende de RLS y de las funciones del servidor.

## 3. Base de datos

Las 17 tablas del esquema `public` son:

- **Cuentas y equipos:** `perfiles`, `equipos`, `jugadores`.
- **Competencia:** `torneos`, `inscripciones`, `grupos`, `grupo_equipos`, `partidos`, `eventos_partido`.
- **Tienda:** `categorias_producto`, `productos`, `variantes_producto`.
- **Compras:** `pedidos`, `pedido_items`, `pagos`, `tickets`.
- **Contacto:** `mensajes_contacto`.

Las relaciones conectan, por ejemplo, capitanes con equipos, equipos con grupos y partidos, productos con sus variantes y partidos, y pedidos con sus artículos, pagos y tickets. Las contraseñas no se guardan en `perfiles`: las administra Supabase Auth. El perfil comparte el UUID de `auth.users` y guarda nombre visible, correo y rol.

Los roles son `admin`, `equipo` y `aficionado`. Las modalidades son fútbol 11, 8 y 5; torneos, partidos, inscripciones, pagos, pedidos y tickets usan estados definidos para cada flujo.

La vista `tabla_posiciones` parte de `grupo_equipos` y suma solo los partidos de grupo que están jugados. Calcula PJ, G, E, P, GF, GC, diferencia y puntos (3 por victoria, 1 por empate). Por eso también muestra con ceros a un equipo que todavía no jugó.

### Funciones RPC

- **`crear_pedido(items)`**: requiere sesión; valida la lista y el stock, toma el precio vigente de `productos`, reserva el stock y crea un pedido `pendiente_pago`, sus artículos y un pago `pendiente`. Rechaza entradas sin partido o de partidos ya jugados. No confía en precios enviados por el navegador ni genera tickets.
- **`confirmar_pago_simulado(p_pedido_id)`**: solo acepta el pedido del usuario autenticado. Marca el pago y el pedido como aprobados/pagados y genera un ticket por cada entrada. Es idempotente para un pedido ya pagado y devuelve sus tickets.
- **`cancelar_pedido(p_pedido_id)`**: solo permite cancelar el pedido propio pendiente; devuelve el stock reservado y cancela el pago pendiente. No cancela pedidos pagados.
- **`crear_equipo(p_nombre, p_logo_url)`**: crea un equipo con el usuario actual como capitán y cambia su rol a `equipo`; si ya es administrador, conserva `admin`. No permite asignar el rol `admin`.

Las implementaciones privilegiadas están en el esquema `private`; las funciones RPC expuestas en `public` actúan como wrappers. Los wrappers permiten ejecutar las operaciones a `authenticated`, no a `anon`, y las funciones validan la identidad y propiedad con `auth.uid()`.

### Migraciones

La tabla de historial de Supabase registra estas tres migraciones:

1. **`20261006001436_fase1_esquema_inicial`**: crea los tipos, tablas, restricciones, índices, vista y funciones base.
2. **`20261006012025_fase2_politicas_rls`**: activa RLS, agrega las políticas y grants para acceso público, usuarios, capitanes y administradores.
3. **`20261006014450_fase3_capitan_opcional`**: permite que `equipos.capitan_id` sea nulo para cargar equipos de ejemplo antes de registrar capitanes.

Los tres SQL están guardados en `supabase/migrations/`, junto con el seed idempotente `supabase/seed.sql`. Los archivos de Fase 1 y Fase 2 se recuperaron de los argumentos exactos enviados a `apply_migration` en esta sesión, incluidas las correcciones aplicadas; sus SHA-256 se contrastaron con esos argumentos. No se reconstruyeron de memoria ni se volvieron a aplicar. El historial remoto, las tablas, las políticas y las funciones se consultaron para comprobar el estado desplegado. La Fase 3 hace que `equipos.capitan_id` sea nullable después de la definición inicial de Fase 1.

## 4. Seguridad

- **RLS:** está activado en las 17 tablas. Las lecturas de torneos, grupos, equipos, fixture, eventos, categorías y productos activos son públicas; las inscripciones se muestran públicamente solo aprobadas. `tabla_posiciones` publica estadísticas de la competencia.
- **Perfiles:** cada persona puede leer su perfil. Solo puede actualizar `nombre_usuario`; los grants de columna impiden que el cliente cambie `rol`, `email` o `id`. El administrador puede gestionar perfiles.
- **Equipos e inscripciones:** el público puede consultar equipos. Crear un equipo pasa por `crear_equipo`; el capitán modifica su equipo y presenta inscripciones pendientes mientras el torneo esté abierto. El administrador valida la inscripción. Los datos sensibles de jugadores (DNI y ficha médica) solo los pueden consultar el capitán correspondiente y el administrador.
- **Compras:** cada usuario lee únicamente sus pedidos, artículos, pagos y tickets. El cliente no tiene permisos directos de escritura en esas tablas: llama a las RPC, que comprueban propiedad y hacen los cambios relacionados como una operación de base de datos. El administrador puede administrar los datos previstos, incluido el estado del ticket.
- **Precio y stock:** el navegador manda solamente `variante_id` y `cantidad`. Postgres obtiene los precios, calcula el total, bloquea las variantes durante la reserva y comprueba el stock disponible. Cambiar JavaScript, modificar localStorage o mandar otra petición no cambia el precio ni evita las políticas de la base.
- **Pago real:** la confirmación actual es deliberadamente simulada. Un usuario autenticado puede pedir la confirmación simulada de su propio pedido; eso sirve para demostrar el flujo, pero no demuestra que haya ingresado dinero. Para producción debe integrarse un proveedor y confirmar el pago desde un webhook/backend confiable.
- **Claves:** el frontend contiene solo la clave `publishable`. Nunca debe agregarse `service_role`, una clave `sb_secret` ni otra credencial privada al HTML, JavaScript o Git.
- **XSS:** los datos que vienen de Postgres se agregan con `textContent`, nodos de texto y elementos creados por DOM. En los módulos JavaScript revisados no se usa `innerHTML`, `outerHTML` ni `insertAdjacentHTML`.
- **Administración visual:** el botón de crear torneos se muestra tras consultar `perfiles.rol`, pero eso es solo presentación. Un usuario puede modificar el navegador; la política RLS de `torneos` vuelve a comprobar `admin` al intentar insertar.
- **Esquema `private`:** las rutinas internas y `es_admin()` se separan de las tablas de lectura del frontend. Las funciones públicas son wrappers controlados y el cliente no puede llamar a las implementaciones privadas directamente mediante los RPC públicos.

Para promover una cuenta ya registrada, hacerlo manualmente desde el SQL Editor con el correo correcto:

```sql
UPDATE public.perfiles
SET rol = 'admin'
WHERE email = 'TU_EMAIL';
```

No hay un formulario de cliente que permita autoconcederse `admin`.

## 5. Cambios archivo por archivo

### JavaScript

| Archivo | Antes | Ahora y flujo principal |
| --- | --- | --- |
| `JS/supabaseClient.js` (nuevo) | No había cliente de base de datos. | Crea y exporta un cliente supabase-js v2 con persistencia de sesión y detección del enlace de Auth. Usa URL y clave `publishable`. |
| `JS/auth.js` (nuevo) | La barra no reflejaba una sesión real. | Consulta Auth, escucha cambios de sesión y actualiza la barra con nombre/correo y cerrar sesión. El nombre se escribe con `textContent`; la consulta del perfil queda fuera del callback de `onAuthStateChange`. Redirige a una persona ya autenticada fuera de login/registro. |
| `JS/inicioSesion.js` | Mostraba una alerta de acceso ficticio y redirigía a un dashboard inexistente. | Valida el formulario, llama a `signInWithPassword`, informa errores en español y vuelve al inicio al autenticar. |
| `JS/registrarse.js` | Simulaba el alta con una alerta. | Verifica nombre, contraseña mínima y confirmación; llama a `signUp` y pasa `nombre_usuario` en `options.data`. Si Auth exige confirmar correo, muestra esa indicación. |
| `JS/olvidastecontra.js` (nuevo) | No había recuperación conectada. | Llama a `resetPasswordForEmail` con retorno a `HTML/restablecer.html` y muestra un mensaje que no revela si el correo existe. |
| `JS/restablecer.js` (nuevo) | No había actualización de contraseña. | Verifica contraseña y confirmación, usa `updateUser({ password })` en la sesión de recuperación y avisa si el enlace venció. |
| `JS/app.js` | Dibujaba posiciones y una llave estática para resultados. | Los resultados se movieron a `JS/resultados.js`; ahora maneja el menú móvil del inicio y envía el formulario de contacto a `mensajes_contacto`. |
| `JS/torneos.js` | Búsqueda y botones operaban sobre tarjetas HTML precargadas. | Lee torneos de Postgres, filtra por nombre y modalidad, y muestra carga/vacío/error. Consulta el rol para mostrar “Nuevo torneo”; el insert sigue protegido por RLS. |
| `JS/partidos.js` | El calendario usaba fechas y cruces escritos en el código; no consultaba el fixture. | Lee partidos programados con nombres de ambos equipos, arma tarjetas desplazables y agrega esos encuentros al calendario mensual. |
| `JS/resultados.js` | Grupos, posiciones y participantes de la llave eran datos estáticos. | Consulta `tabla_posiciones`, grupos, equipos y partidos eliminatorios. Ordena por puntos, diferencia y goles a favor; muestra resultados, fechas y placeholders si faltan equipos. Conserva la llave visual con cuartos, semifinales, final y conectores. |
| `JS/productos.js` | Los productos, variantes, precios, subtotal y checkout eran locales/ficticios. | Lee productos, variantes, precio y stock reales; filtra y busca, guarda en localStorage solo UUID de variante y cantidad, y llama a las RPC para reservar y confirmar. Tras el pago simulado muestra el código y QR. Si falla la confirmación intenta liberar la reserva. |
| `JS/misCompras.js` (nuevo) | No existía historial. | Comprueba sesión y consulta solo los pedidos visibles para esa cuenta; muestra artículos, pagos reflejados en el estado del pedido, tickets y QR. La RLS vuelve a filtrar en la base. |
| `JS/sidebar.js` | Menú lateral responsive existente. | No se modificó; se conserva la interacción del menú. |

### HTML

| Archivo | Antes | Ahora y flujo principal |
| --- | --- | --- |
| `index.html` | Presentaba el sitio y el formulario de contacto sin persistencia. | Agrega el contenedor de sesión, estados del formulario y carga el módulo que inserta mensajes de contacto. |
| `HTML/torneos.html` | Mostraba tarjetas y filtros asociados a datos estáticos. | Deja un contenedor dinámico, estado de carga, búsqueda, modalidades y diálogo de alta oculto inicialmente para administradores. |
| `HTML/partidos.html` | Contenía fixture de muestra. | Presenta espacios para el carrusel y calendario que llena `partidos.js`, además de controles de navegación y mensajes de estado. |
| `HTML/Resultados.html` | Enlazaba el render estático. | Carga `resultados.js`; conserva las pestañas de grupos/eliminatoria y los contenedores para datos dinámicos. |
| `HTML/productos.html` | Tenía catálogo de ejemplo y un total local del carrito. | Define el catálogo, filtros, detalle, carrito, checkout, comprobante y QR como contenedores vacíos que llena JavaScript. El total se rotula como calculado por el servidor. |
| `HTML/incioSesion.html` | Formulario conectado a una simulación. | Identifica la ruta de login para redirigir sesiones existentes y presenta mensajes accesibles del flujo de Auth. |
| `HTML/Registrarse.html` | Formulario conectado a una simulación. | Identifica la ruta de registro, añade validación de contraseña y presenta respuestas de Auth. |
| `HTML/olvidastecontra.html` | No podía enviar recuperación a Supabase. | Añade el formulario con estado y la barra de sesión para solicitar un enlace de recuperación. |
| `HTML/restablecer.html` (nuevo) | No existía página de retorno del correo. | Permite elegir la nueva contraseña a partir de la sesión temporal de recuperación de Supabase. |
| `HTML/misCompras.html` (nuevo) | No había pantalla de historial. | Muestra pedidos propios, entradas y códigos QR; carga QRCode.js desde CDN con integridad SRI. |

Los estilos modificados o añadidos mantienen el aspecto del sitio y dan presentación a la barra de sesión, estados de carga, tienda, historial y calendario (`CSS/auth.css`, `CSS/tienda.css` y el ajuste de `CSS/partidos.css`).

### Correcciones durante esta revisión

- **`JS/productos.js`:** se ignoraba `?filter=entradas`, aunque el botón “Ver entradas” desde partidos lo agregaba al enlace. Ahora el filtro se inicializa desde la URL y se marca el botón correcto.
- **`JS/productos.js`:** el respaldo de imagen era `logo_d1os_cup.png`, que no existe en `assets/`. Ahora usa la camiseta oficial existente.
- **`JS/productos.js`:** si la petición de `cancelar_pedido` rechazaba en la red, el error escapaba del manejo y no se mostraba el estado de la reserva. Ahora también captura ese rechazo y conserva el identificador del pedido para soporte.
- **`JS/resultados.js`:** la primera versión dinámica había reemplazado la llave conectada original por tres listas sencillas, sin los conectores ni las clases estilizadas existentes. Se restauró el diseño de dos lados, semifinales y final, creando todos los nodos dinámicos con DOM y texto seguro.
- **`.gitignore`:** incluye `.obsidian/` porque esa configuración local se quitó del índice y debe permanecer solo en el disco de trabajo.

## 6. Cómo probarlo

1. Abrir el repo con VS Code y servir `index.html` con Live Server en `http://127.0.0.1:5500/`. Las páginas usan módulos ES; no abrirlas con `file://`.
2. Ir a **Registrarse**, crear una cuenta y confirmar el correo si Auth lo solicita. Iniciar sesión y revisar que la barra muestre el nombre/correo y permita cerrar sesión.
3. En **Olvidaste tu contraseña**, solicitar recuperación, abrir el correo y guardar una nueva contraseña en la página de retorno. Supabase Auth debe tener permitido ese redirect de Live Server.
4. Abrir **Torneos**: probar búsqueda y modalidades. Para probar el alta, promover manualmente una cuenta de prueba a `admin` con el SQL anterior, volver a iniciar sesión y crear un torneo. Intentar insertar desde una cuenta normal debe fallar por RLS aunque se fuerce el botón desde las herramientas del navegador.
5. Abrir **Partidos** y **Resultados**: revisar los partidos programados, mover el calendario, abrir ambas pestañas y comparar las posiciones con partidos jugados.
6. Abrir **Productos**: probar búsqueda y categorías, incluida la categoría Shorts vacía; elegir una variante con stock, agregarla y finalizar. En la demo, el pedido se reserva y se confirma como pago simulado; la pantalla muestra el total recibido del servidor y los QR.
7. Ir a **Mis compras / entradas** y verificar que el pedido, el artículo y los tickets coincidan. Repetir con otra cuenta y confirmar que no puede leer las compras de la primera.
8. En el inicio, enviar un mensaje de contacto válido y revisar el mensaje de éxito.

No se deben probar escrituras de compras en producción sin acordarlo: una compra de demostración cambia stock y crea pedidos, pagos y tickets reales en la base.

## 7. Limitaciones conocidas y mejoras futuras

- El pago es simulado, no está integrado con Mercado Pago. La RPC de confirmación no verifica una transacción externa.
- Los pedidos pendientes no vencen automáticamente. Si alguien abandona el checkout, el stock queda reservado hasta cancelar el pedido. Una respuesta de red perdida justo al crear un pedido también puede dejar una reserva que requiere conciliación.
- Las inscripciones validan estado del torneo y capitán, pero todavía no bloquean una nueva inscripción cuando se alcanza `cupo_equipos`.
- La categoría **Shorts** está creada y aparece en los filtros, pero actualmente contiene cero productos activos en la base.
- La entrega de confirmación y recuperación de correo depende de la configuración y cuotas del plan de Supabase; hay que comprobarla para el dominio final.
- La página de resultados no tiene todavía un selector de torneo; si se cargan llaves eliminatorias para varios torneos, conviene agregar selección para no mezclarlas.
- El historial se consultó por pedido y relaciones de PostgREST; no se probó con una cuenta de usuario real ni con una compra real durante esta revisión.
- La revisión ejecutó chequeo sintáctico de los 13 JavaScript, `git diff --check`, lectura del esquema y funciones por MCP y cuatro consultas de lectura a la Data API (HTTP 200: 3 torneos, 16 partidos programados, 22 filas de posiciones y 8 productos). No se completó un flujo de navegador con login, correo, QR ni checkout: faltan credenciales de una cuenta de prueba y no se modificó la base de producción para simular una compra.

## 8. Preguntas probables en la defensa

**¿Por qué Supabase y no MySQL?**  
Porque el alcance pedía un backend pero el frontend debía seguir estático. Supabase brinda Postgres, Auth y API con RLS sin tener que construir y alojar un servidor propio. MySQL estaba en la propuesta inicial; se reemplazó por Postgres administrado.

**¿Qué pasa si alguien cambia el JavaScript desde el navegador?**  
Puede cambiar lo que ve o los datos locales, pero no puede concederse permisos ni escribir directamente en pedidos. Postgres aplica RLS y las RPC vuelven a validar usuario, propiedad, stock y precio.

**¿Cómo se evita comprar sin pagar?**  
En la demo, crear el pedido solo lo deja pendiente y reserva stock; recién `confirmar_pago_simulado` lo marca pagado y emite tickets. Como es un simulador, el propio dueño puede llamar esa RPC: no equivale a cobrar. Para producción se debe confirmar el pago con el proveedor desde un webhook confiable.

**¿Por qué no hay un backend propio si se llama a Postgres?**  
El navegador usa la API administrada de Supabase. La parte privilegiada se concentra en RLS y funciones RPC dentro de Postgres; no hace falta desplegar un servidor de aplicación separado para este alcance.

**¿La clave que aparece en JavaScript es secreta?**  
No: es la clave `publishable`, prevista para el cliente. La clave `service_role` y las claves secretas no se publican; RLS limita el acceso de la clave pública.

**¿Por qué calcular el total en la base?**  
Porque el navegador es modificable. La RPC toma precios actuales desde `productos`, calcula el total y descuenta stock; el cliente solo envía variantes y cantidades.

**¿Cómo se protege el rol administrador?**  
RLS consulta `perfiles.rol`; los usuarios no reciben permiso de actualizar esa columna. La promoción se hace manualmente desde SQL Editor y `crear_equipo` solo asigna el rol `equipo`.

**¿Cómo se evita XSS al mostrar el nombre de un equipo o producto?**  
Los valores de base se asignan con `textContent` o nodos de texto, no se interpolan en HTML.

**¿El QR demuestra que se cobró la entrada?**  
No. Identifica el ticket emitido después de la confirmación simulada. La validación final del QR y la integración de cobro real son trabajo futuro.

**¿Qué quedó sin comprobar?**  
No se ejecutó el flujo completo de Auth, emails y compra con una cuenta real ni se validó visualmente cada pantalla en navegador. Sí se comprobó sintaxis, columnas/relaciones, definiciones de RPC y respuestas de lectura de la Data API.
