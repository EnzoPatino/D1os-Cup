# D10S Cup — Plan de pruebas funcionales

**Versión 1.0 · Taller de Construcción de Software · 2026**

## 1. Objetivo y alcance

Definir una ejecución repetible de pruebas funcionales y de aceptación para las páginas y flujos disponibles: navegación, Auth, torneos, fixture, resultados, tienda/carrito, pedidos propios, contacto, permisos y persistencia. No reemplaza una auditoría de seguridad, pruebas de carga ni pruebas de cobro real.

## 2. Entornos y datos

- **Entorno recomendado:** Preview o proyecto Supabase de demostración separado de producción.
- Navegador actualizado, conexión estable y consola de desarrollador disponible.
- Cuentas: usuario nuevo de prueba, usuario común y cuenta administradora controlada.
- Datos: un torneo de prueba, encuentros programados/jugados, grupos y posiciones, productos con una variante disponible y otra sin stock.
- Registrar fecha, navegador, build/commit, usuario de prueba, resultado, evidencia y defecto.
- Antes de un checkout, confirmar entorno, producto y stock. El checkout cambia datos persistentes.

## 3. Severidad

**Bloqueante:** impide demo segura o acceso esencial. **Alta:** flujo principal incorrecto o exposición de datos. **Media:** función secundaria no cumple. **Baja:** defecto visual/copy sin impedir uso.

## 4. Casos de prueba

| ID | Flujo y pasos | Resultado esperado | Tipo / impacto |
|---|---|---|---|
| NAV-01 | Abrir portada; seguir Productos, Torneos, Partidos, Resultados; usar volver e inicio. | Cada destino carga con estilos/scripts y sin 404 de recursos. | Manual, alta |
| NAV-02 | Repetir navegación en ancho móvil; abrir/cerrar menú. | Controles accesibles y contenido sin desbordamiento crítico. | Manual, media |
| AUTH-01 | Registrar correo de prueba con contraseña válida; completar confirmación si se solicita. | Mensaje de alta; cuenta creada según configuración Auth. | Integración, alta |
| AUTH-02 | Iniciar sesión con cuenta de prueba y luego cerrar sesión. | Sesión reflejada en interfaz; cierre termina la sesión. | Integración, alta |
| AUTH-03 | Intentar login con contraseña incorrecta. | Error claro; no se inicia sesión ni se revela información sensible. | Negativa, media |
| AUTH-04 | Solicitar restablecimiento y seguir correo/enlace con URL permitida. | Página permite actualizar contraseña mientras el enlace sea válido. | Integración, alta |
| TOR-01 | Buscar torneo por nombre y filtrar por modalidad. | Resultados coinciden con los criterios; vacío se comunica correctamente. | Funcional, media |
| TOR-02 | Como usuario común, intentar alta; como admin, crear torneo de prueba con datos válidos. | Usuario común rechazado por autorización; admin crea registro y aparece en listado. | Permisos/DB, alta; limpiar datos luego |
| FIX-01 | Abrir Partidos; recorrer carrusel; cambiar mes/día con partido. | Se muestran solo encuentros cargados y sus datos correctos. | Integración, media |
| RES-01 | Abrir grupos y eliminatorias; contrastar tabla con partidos jugados. | PJ, G/E/P, GF/GC, diferencia y puntos son consistentes; faltantes se representan sin romper página. | Integración, alta |
| SHOP-01 | Buscar y filtrar productos; abrir detalle; elegir variante. | Catálogo muestra activos; variante, precio y disponibilidad correctos. | Funcional, alta |
| SHOP-02 | Agregar producto disponible, modificar cantidad y quitar ítem. | Carrito y subtotales se actualizan correctamente. | Funcional, media |
| SHOP-03 | Con cuenta autenticada, completar checkout solo en entorno demo. | Stock se reserva, pedido se confirma como simulado y ticket QR aparece si incluye entrada. | Escritura/DB, alta; requiere aprobación del responsable de demo |
| SHOP-04 | Repetir con stock insuficiente o usuario sin sesión. | Operación se rechaza con mensaje; no queda pedido pagado/ticket indebido. | Negativa, alta; entorno demo |
| SHOP-05 | Abrir Mis compras con el dueño y después con otra cuenta. | Dueño ve el pedido; segunda cuenta no puede consultar los datos ajenos. | Aislamiento/RLS, bloqueante |
| CONTACT-01 | Enviar formulario válido y luego inválido/incompleto. | Válido da confirmación y persiste; inválido no genera mensaje y muestra validación. | Integración, media |
| SEC-01 | Como usuario común, intentar manipular interfaz para mostrar acción admin y enviar operación. | La base/RLS rechaza la operación, aunque se altere la UI. | Permisos, bloqueante |
| SEC-02 | Revisar frontend/red: no deben aparecer `service_role`, `sb_secret` ni credenciales privadas. | Solo clave publicable en el cliente; ninguna clave privada filtrada. | Seguridad, bloqueante |
| ERR-01 | Simular pérdida de red o consultar con backend no disponible. | La página informa estado/error sin bloquear toda la navegación ni mostrar falso éxito. | Resiliencia, media |

## 5. Criterios de salida

- 100% de casos bloqueantes y altos aprobados o con excepción documentada.
- Sin fuga de datos entre cuentas ni credenciales privadas en bundle.
- Flujos de escritura corridos únicamente sobre datos/cuentas de demo.
- Evidencias guardadas en el repositorio de trabajo del equipo con datos personales ocultos.
- Defectos pendientes con responsable, severidad y decisión de aceptación.

## 6. Registro de ejecución

| ID | Fecha / entorno | Resultado (Aprobado/Fallido/No ejecutado) | Evidencia / incidencia | Responsable |
|---|---|---|---|---|
| Completar durante la sesión de prueba | | | | |

## 7. Límites

La confirmación de pago simulada no verifica una transacción externa. El QR no se validó con lector. Las pruebas destructivas o con impacto de stock quedan fuera de producción. Este plan no afirma que los casos estén ejecutados; es la guía para la sesión de QA y defensa.
