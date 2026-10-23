# Manual de Usuario — D10S Cup
**Plataforma Web de Organización Deportiva y Gestión de Torneos de Fútbol**

* **Proyecto:** D10S Cup  
* **Cátedra:** Taller de Construcción de Software — Año 2026  
* **Profesor:** Alexis Martínez  
* **Integrantes:** Huechepan Santiago, Marteniuk Ignacio, Namuncura Joaquín, Enzo Patiño  
* **Versión:** 1.0 (Octubre 2026)

---

## 1. Introducción y Objetivo del Manual

El objetivo de este manual de usuario es dar a conocer y detallar todas las funcionalidades de la plataforma web **D10S Cup**, permitiéndole al usuario tener una navegación más sencilla, intuitiva y facilitarle el uso integral del sistema.

**D10S Cup** es una solución digital integral concebida para la gestión y seguimiento de torneos deportivos de fútbol (Fútbol 11, Fútbol 8 y Fútbol 5). Permite administrar competencias, consultar calendarios y resultados en tiempo real, e integrar una tienda oficial para la compra de indumentaria y entradas digitales con código único o QR.

---

## 2. Tipos de Usuario (Roles del Sistema)

El sistema contempla tres perfiles de usuarios con diferentes niveles de acceso y permisos:

### 2.1. Administrador del Torneo
* Creación, edición y supervisión integral de torneos.
* Validación y aprobación de inscripciones de equipos y listas de buena fe.
* Programación del fixture (asignación de fechas, horarios, canchas y estadios).
* Carga de actas de partidos y resultados finales (goles, tarjetas amarillas/rojas y asistencias).
* Gestión del catálogo de la tienda: carga de indumentaria, talles, precios y stock.
* Control de tickets de entradas y consulta de reportes estadísticos y de ventas.

### 2.2. Equipos (Capitanes y Delegados)
* Registro del equipo en la plataforma.
* Inscripción en torneos disponibles según cupos y modalidad.
* Gestión de la plantilla de jugadores (lista de buena fe con datos personales y números de camiseta).
* Consulta personalizada del fixture, fechas asignadas, resultados y estadísticas del equipo.

### 2.3. Aficionados y Público General
* Registro y acceso seguro con cuenta de usuario.
* Navegación por el catálogo oficial de la tienda.
* Compra de entradas para los partidos de cada fase del torneo con emisión de ticket digital.
* Compra de indumentaria oficial (camisetas, shorts, accesorios).
* Seguimiento en vivo del calendario de partidos, tablas de posiciones y llaves eliminatorias.

---

## 3. Acceso a la Plataforma (Autenticación)

El acceso a las funciones personalizadas y de compra se realiza desde el módulo de autenticación.

```
       +---------------------------------------------+
       |           Pantalla de Inicio                |
       |       (index.html - Barra Superior)         |
       +----------------------+----------------------+
                              |
            +-----------------+-----------------+
            |                                   |
            v                                   v
+-----------------------+           +-----------------------+
|    Iniciar Sesión     |           |      Registrarse      |
|  (incioSesion.html)   |           |  (Registrarse.html)   |
+-----------+-----------+           +-----------------------+
            |
            v
+-----------------------+
|  Recuperar Contraseña |
| (olvidastecontra.html)|
+-----------------------+
```

### 3.1. Iniciar Sesión (`incioSesion.html`)
Permite ingresar al sistema a usuarios previamente registrados.
1. Ingrese su **Correo electrónico** registrado.
2. Ingrese su **Contraseña**.
3. Haga clic en el botón **"Ingresar"**.
4. Si aún no recuerda su clave, puede acceder mediante el enlace **"¿Olvidaste tu contraseña?"**.
5. Si desea regresar a la portada, haga clic en el botón **"Volver"**.

> 📷 **[Captura de pantalla: Pantalla de Inicio de Sesión]**  
> *(Espacio para insertar imagen del formulario de inicio de sesión: `HTML/incioSesion.html`)*

---

### 3.2. Crear Cuenta / Registrarse (`Registrarse.html`)
Si el usuario no cuenta con una cuenta creada, puede registrarse de manera rápida completando el formulario:
1. **Nombre de usuario:** Nombre visible en la plataforma.
2. **Correo electrónico:** Correo activo para notificaciones y tickets de compra.
3. **Contraseña:** Clave de seguridad privada.
4. **Confirmar contraseña:** Validación exacta de la clave ingresada.
5. Haga clic en el botón **"Registrarse"** para confirmar el alta.
6. Cuenta con accesos directos para **"Volver a iniciar sesión"** o **"Ir al inicio"**.

> 📷 **[Captura de pantalla: Pantalla de Registro de Cuenta]**  
> *(Espacio para insertar imagen de registro: `HTML/Registrarse.html`)*

---

### 3.3. Recuperación de Contraseña (`olvidastecontra.html`)
En caso de extravío u olvido de la clave de acceso:
1. Introduzca su correo electrónico vinculado a su cuenta.
2. Presione el botón **"Ingresar"** (solicitar restablecimiento).
3. El sistema verificará la casilla y enviará las instrucciones para redefinir una nueva contraseña de forma segura.

> 📷 **[Captura de pantalla: Recuperación de Contraseña]**  
> *(Espacio para insertar imagen de recuperación: `HTML/olvidastecontra.html`)*

---

## 4. Página Principal de Inicio (`index.html`)

Es la página de bienvenida y presentación general de **D10S Cup**, pensada para guiar al usuario a cualquier punto del torneo.

### Componentes Principales:
* **Barra de Navegación Superior:**
  * Logo oficial de la D10S Cup.
  * Enlaces directos a: **Inicio**, **Productos** y **Contactos**.
  * Botones rápidos de **Iniciar Sesión** y **Registrarse**.
  * Menú hamburguesa desplegable optimizado para teléfonos celulares y tablets.
* **Sección Hero:**
  * Distintivo del "Torneo Oficial 2026".
  * Logo de alta resolución y lema motivacional del torneo.
* **Destacados de Tienda y Entradas:**
  * Vista previa interactiva de las entradas para los partidos más trascendentes.
  * Exhibición de la indumentaria oficial con botón para ir a la tienda completa.
* **Sección de Contactos y Redes Sociales:**
  * Formulario directo para consultas: Nombre completo, Correo electrónico, Teléfono y Mensaje.
  * Enlaces a canales oficiales de comunicación (Instagram, Twitter, YouTube).

> 📷 **[Captura de pantalla: Portada Principal / Landing Page]**  
> *(Espacio para insertar imagen de portada: `index.html`)*

---

## 5. Módulo de Torneos (`torneos.html`)

Este módulo permite explorar todas las competiciones deportivas gestionadas bajo la organización D10S Cup.

### Funcionalidades:
* **Búsqueda Dinámica:** Caja de texto superior con buscador en tiempo real para localizar torneos por su nombre.
* **Filtros por Modalidad:** Botones de segmentación rápida:
  * **Todos:** Visualiza la totalidad de torneos disponibles.
  * **Fútbol 11:** Torneos de cancha reglamentaria de 11 jugadores.
  * **Fútbol 8:** Torneos en césped sintético modalidad 8 vs 8.
  * **Fútbol 5:** Torneos relámpago y ligas de salón / fútbol reducido.
* **Botón "+ Nuevo Torneo":**
  * Habilita a los administradores la creación de una nueva competencia (indicando cupos, categorías, fecha de inicio y premios).
* **Fichas Informativas de Torneos:**
  * Cada tarjeta expone el nombre, badge de estado (*Inscripciones Abiertas*, *En Curso*, *Finalizado*), fecha de inicio, cantidad de equipos inscriptos y premio para el campeón.

> 📷 **[Captura de pantalla: Listado y Filtros de Torneos]**  
> *(Espacio para insertar imagen de torneos: `HTML/torneos.html`)*

---

## 6. Módulo de Partidos y Fixture (`partidos.html`)

Permite tanto a los equipos como a los aficionados conocer el cronograma de los partidos programados, sus horarios y canchas asignadas.

### 6.1. Carrusel de Próximos Partidos
* Ubicado en la parte superior con botones de navegación lateral (flechas izquierda `<` y derecha `>`).
* Cada tarjeta muestra:
  * Nombres y avatares / escudos de los dos equipos enfrentados.
  * Cartel central de enfrentamiento (**VS**).
  * Horario exacto y fecha del partido.
  * Ubicación y cancha asignada (ejemplo: *Cancha 1 - Estadio Central*).

### 6.2. Calendario Mensual del Fixture
* Calendario mensual dinámico donde los días con partidos programados se destacan con indicadores visuales.
* Al hacer clic sobre una fecha programada, se despliegan los detalles de los cruces de ese día.

> 📷 **[Captura de pantalla: Carrusel de Partidos y Calendario de Fixture]**  
> *(Espacio para insertar imagen de partidos: `HTML/partidos.html`)*

---

## 7. Módulo de Resultados y Clasificaciones (`Resultados.html`)

En esta sección se encuentra toda la información deportiva tras la disputa de cada jornada. Posee un sistema de pestañas interactivas:

```
        +-----------------------------------------+
        |       VISTA DE RESULTADOS               |
        |  [ Fase de Grupos ] | [ Eliminatoria ]  |
        +--------------------+--------------------+
                             |
         +-------------------+-------------------+
         |                                       |
         v                                       v
+-------------------------------+   +-------------------------------+
|  Tablas de Posiciones         |   |  Llave de Eliminación         |
|  - Grupos A, B, etc.          |   |  - Cuartos de Final           |
|  - PJ, PG, PE, PP             |   |  - Semifinales                |
|  - GF, GC, DIF, PTS           |   |  - Gran Final y Campeón       |
+-------------------------------+   +-------------------------------+
```

### 7.1. Vista de Fase de Grupos
* Muestra la tabla de posiciones clasificada por zonas (Grupo A, Grupo B, etc.).
* Columnas estadísticas estandarizadas:
  * **Equipo:** Nombre y escudo del participante.
  * **PJ:** Partidos Jugados.
  * **G:** Partidos Ganados.
  * **E:** Partidos Empatados.
  * **P:** Partidos Perdidos.
  * **GF:** Goles a Favor.
  * **GC:** Goles en Contra.
  * **DG / DIF:** Diferencia de Gol.
  * **PTS:** Puntos acumulados en la tabla general.

### 7.2. Vista de Fase Eliminatoria (Llaves / Playoff)
* Al presionar la pestaña **"Fase Eliminatoria"**, la pantalla presenta el árbol visual de eliminación directa (*bracket*):
  * **Cuartos de final:** Cruces de los 8 mejores clasificados.
  * **Semifinales:** Partidos de eliminación hacia el podio.
  * **Final:** Encuentro definitorio con marcador final y mención al equipo Campeón.
* Cuenta con el botón **"Volver a Grupos"** para regresar a la vista de tablas con un solo clic.

> 📷 **[Captura de pantalla: Tablas de Grupos y Bracket Eliminatorio]**  
> *(Espacio para insertar imagen de resultados: `HTML/Resultados.html`)*

---

## 8. Tienda Oficial y Carrito de Compras (`productos.html`)

Es el módulo de comercio electrónico de **D10S Cup**, donde los aficionados pueden adquirir sus localidades para los partidos y la indumentaria oficial.

### 8.1. Navegación y Barra Lateral (Sidebar)
* La tienda cuenta con una barra de navegación fija a la izquierda con enlaces a todas las secciones: Inicio, Torneos, Partidos, Resultados y Tienda.

### 8.2. Filtros y Búsqueda de Productos
* Barra de búsqueda para tipear nombres de indumentaria o partidos.
* Filtros por categorías mediante botones interactivos:
  * **Todas:** Muestra todo el catálogo disponible.
  * **Entradas:** Acceso a entradas de partidos (Fase de grupos, Cuartos, Semifinal, Final).
  * **Camisetas:** Indumentaria titular, alternativa y camisetas térmicas.
  * **Shorts:** Pantalones cortos deportivos oficiales.
  * **Accesorios:** Gorras, medias deportivas y merchandising.

### 8.3. Ficha de Producto y Selección
* **Para Entradas:** Permite seleccionar la ubicación deseada (Tribuna Popular, Platea Lateral o Palco Preferencial) e indica la fecha, rivales y sede.
* **Para Indumentaria:** Permite elegir entre talles disponibles (**S**, **M**, **L**, **XL**) y verificar la disponibilidad de stock.
* Al presionar **"Agregar al Carrito"**, el producto se incorpora instantáneamente al resumen de compra.

### 8.4. Carrito de Compras (Drawer Deslizable)
* Se despliega desde el lateral derecho al pulsar el ícono del carrito.
* Informa:
  * Listado de productos agregados con miniatura, nombre y talle/categoría seleccionada.
  * Controles de cantidad (**+** / **-**) para incrementar o decrementar unidades.
  * Botón para eliminar un ítem del carrito.
  * Subtotal actualizado en tiempo real.
  * Botón **"Finalizar Compra"**: Conduce a la confirmación de pago y emisión de los comprobantes y tickets con código QR / identificador de acceso al estadio.

> 📷 **[Captura de pantalla: Catálogo de Productos y Carrito de Compras]**  
> *(Espacio para insertar imagen de la tienda y carrito: `HTML/productos.html`)*

---

## 9. Funcionalidades en Desarrollo / Próximas Actualizaciones

En base a la planificación del proyecto (backend y persistencia en base de datos MySQL), se encuentran contempladas para las siguientes etapas:

1. **Gestión de Planteles y Lista de Buena Fe:** Carga de fichas médicas y DNI de cada jugador por parte de los capitanes.
2. **Validación de Entradas con Lector QR:** Escaneo móvil de tickets digitales en las puertas de acceso a los predios deportivos.
3. **Pasarela de Cobros Online Integrada:** Procesamiento de pagos electrónicos (Mercado Pago / Tarjetas de crédito y débito).
4. **Carga en Vivo de Planillas Arbitrales:** Minuto a minuto de goles y amonestaciones desde el panel del árbitro.

---

## 10. Soporte y Contacto del Proyecto

Para consultas técnicas, sugerencias o reporte de errores en la plataforma:

* **Institución:** Taller de Construcción de Software — 2026  
* **Docente a Cargo:** Profesor Alexis Martínez  
* **Equipo de Desarrollo:**  
  * Santiago Huechepan  
  * Ignacio Marteniuk  
  * Joaquín Namuncura  
  * Enzo Patiño  
* **Canal de Contacto:** Mediante el formulario web ubicado en la sección `#contactos` de `index.html`.
