# D10S Cup — Plan de pruebas funcionales

**Versión:** 1.1
**Fecha:** 26 de octubre de 2026
**Proyecto:** Taller de Construcción de Software

## 1. Objetivo

Definir las comprobaciones necesarias para evaluar la navegación, las cuentas, las secciones deportivas, la tienda y los permisos de D10S Cup. El documento describe pruebas por ejecutar; no presenta resultados ni evidencia de pruebas ya realizadas.

## 2. Alcance

Se probarán la portada y navegación responsive, registro e inicio de sesión, recuperación de contraseña, listado de torneos, partidos y resultados, catálogo y carrito, historial de compras, formulario de contacto y restricciones por rol.

Quedan fuera del alcance el cobro real, pruebas de carga, auditoría completa de seguridad y validación de tickets con lector QR. El pago disponible es simulado.

## 3. Entorno y preparación

- Usar un entorno de Preview o una instancia de Supabase destinada a pruebas. No ejecutar casos que escriban datos en producción.
- Abrir el sitio mediante HTTP/HTTPS, no mediante `file://`. Para desarrollo local, ejecutar `npm run dev` y abrir <http://localhost:8000>.
- Registrar versión o commit, fecha, navegador y tamaño de pantalla.
- Preparar una cuenta nueva, una cuenta común confirmada, una cuenta administrativa de prueba y acceso a los correos de prueba.
- Preparar datos conocidos: un torneo por modalidad, partidos programados y jugados, grupos con equipos, un producto con stock y otro sin stock.
- Antes de probar pedidos, confirmar que se está en el entorno de prueba y anotar el stock inicial. Las compras crean registros y modifican stock.
- Para probar el rol administrador, usar una cuenta de prueba autorizada. No cambiar roles de cuentas reales.

## 4. Prioridad

**P1 — Alta:** falla de acceso, exposición de datos, permisos incorrectos o bloqueo de un flujo principal.

**P2 — Media:** función disponible con comportamiento incorrecto, sin comprometer datos sensibles.

**P3 — Baja:** defecto visual o de texto que no impide completar el flujo.

## 5. Casos de prueba

El estado inicial de todos los casos es **Pendiente**. Registrar el resultado real en la tabla de ejecución después de realizarlos.

| ID | Caso y pasos | Resultado esperado | Prioridad |
|---|---|---|---|
| NAV-01 | Desde Inicio abrir Torneos, Partidos, Resultados y Tienda; volver a Inicio desde cada sección. | Cada página abre correctamente, conserva estilos y carga sus recursos sin errores 404. | P2 |
| NAV-02 | Repetir la navegación en móvil; abrir y cerrar el menú lateral y usar sus enlaces. | El menú responde, se puede cerrar y el contenido no queda cortado ni provoca desplazamiento horizontal. | P2 |
| AUTH-01 | Registrar una cuenta nueva con nombre, correo y contraseña válida; confirmar el correo si se solicita. | Se informa el resultado del registro y la cuenta queda disponible según la configuración de Auth. | P1 |
| AUTH-02 | Iniciar sesión con el correo y contraseña correctos; cerrar sesión desde el menú de usuario. | Se muestra la sesión y el cierre elimina el acceso autenticado. | P1 |
| AUTH-03 | Iniciar sesión con el nombre de usuario y la contraseña correctos. | La cuenta inicia sesión y el perfil muestra el usuario esperado. | P1 |
| AUTH-04 | Probar correo o usuario inexistente y contraseña incorrecta. | Se muestra un error entendible; no se inicia sesión ni se revela información privada. | P1 |
| AUTH-05 | Solicitar recuperación de contraseña, abrir el enlace recibido y guardar una contraseña nueva. | El enlace permitido abre el formulario y la contraseña se actualiza; un enlace vencido informa el problema. | P1 |
| TOR-01 | Buscar un torneo existente y filtrar por fútbol 11, 8 y 5. Repetir con una búsqueda sin resultados. | Los filtros y la búsqueda corresponden con los datos; el estado vacío se informa claramente. | P2 |
| TOR-02 | Con cuenta común intentar crear torneo; luego repetir con la cuenta administradora de prueba. | La cuenta común no puede crear; el administrador crea el registro y aparece en el listado. | P1 |
| FIX-01 | Abrir Partidos, recorrer el carrusel y cambiar el mes del calendario. Seleccionar días con y sin partidos. | Se muestran los partidos cargados con fecha y equipos correctos; los días vacíos no muestran cruces falsos. | P2 |
| RES-01 | Abrir Resultados y comparar una tabla con los partidos jugados del grupo. Cambiar entre grupos y eliminatorias. | PJ, ganados, empatados, perdidos, goles y puntos coinciden con los datos; la navegación entre vistas funciona. | P1 |
| SHOP-01 | Buscar productos y filtrar por categoría; abrir un detalle y elegir una variante disponible. | Se ven productos activos, precio y variantes correctas; no se ofrece stock inexistente. | P1 |
| SHOP-02 | Añadir un producto al carrito, cambiar cantidad, quitarlo y volver a cargar la página. | Cantidades y total se actualizan; al recargar, el carrito conserva solo los artículos guardados por la aplicación. | P2 |
| SHOP-03 | Con usuario autenticado y producto de prueba con stock, finalizar un pedido de demostración. | Se crea el pedido, el stock se reserva y el sitio identifica el pago como simulado. Si incluye entrada, aparece el ticket emitido. | P1 |
| SHOP-04 | Intentar comprar una variante sin stock y probar checkout sin sesión. | La operación se rechaza con un mensaje; no aparece una compra pagada ni un ticket indebido. | P1 |
| SHOP-05 | Abrir Mis compras con la cuenta propietaria y luego con una segunda cuenta. | La primera cuenta ve sus pedidos; la segunda no puede consultar los pedidos ni tickets ajenos. | P1 |
| CONTACT-01 | Enviar el formulario de contacto completo y luego intentar enviarlo vacío o con datos inválidos. | El envío válido confirma el resultado; los datos inválidos se rechazan y no generan un registro. | P2 |
| SEC-01 | Con cuenta común intentar forzar desde el navegador la creación de un torneo u otra operación restringida. | La base rechaza la operación aunque se altere la interfaz. | P1 |
| SEC-02 | Revisar los recursos del cliente y las respuestas de red durante una sesión. | No se exponen claves privadas o `service_role`; el cliente usa solo credenciales publicables. | P1 |
| ERR-01 | Desconectar la red o impedir temporalmente la respuesta de Supabase y abrir una sección con datos. | Se informa el error o estado de carga; no se muestra un éxito falso y el resto de la navegación sigue disponible. | P2 |

## 6. Registro de ejecución

Completar una fila por cada ejecución. Usar `Aprobado`, `Fallido` o `No ejecutado`. Adjuntar una captura o referencia de incidencia cuando corresponda y ocultar datos personales.

| ID | Fecha y entorno | Resultado | Evidencia o incidencia | Responsable |
|---|---|---|---|---|
| Completar al ejecutar los casos | | Pendiente | | |

## 7. Criterios de aceptación

- Todos los casos P1 se aprueban o tienen una incidencia aceptada y documentada por el equipo.
- No hay acceso entre cuentas a compras, tickets o datos privados.
- Las acciones administrativas son rechazadas para una cuenta común tanto en la interfaz como en la base.
- Los casos que modifican datos se ejecutan solo en un entorno de prueba y sus registros se identifican para limpieza posterior.
- Se conserva evidencia suficiente para reproducir cada fallo y se registran navegador, fecha y versión probada.

## 8. Límites

La confirmación de compra es simulada y no verifica una transacción monetaria. El QR identifica un ticket, pero este plan no comprueba su lectura o validación en una entrada. La ejecución de este plan no sustituye una auditoría de seguridad ni pruebas de carga.
