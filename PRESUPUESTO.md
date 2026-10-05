# Presupuesto de Desarrollo del Sistema — D10S Cup
**Plataforma de Organización Deportiva y Gestión de Torneos de Fútbol**

* **Proyecto:** D10S Cup  
* **Cátedra:** Taller de Construcción de Software — Año 2026  
* **Profesor:** Alexis Martínez  
* **Integrantes del Equipo de Desarrollo:**  
  * Huechepan Santiago  
  * Marteniuk Ignacio  
  * Namuncura Joaquín  
  * Enzo Patiño  
* **Fecha de Emisión:** Octubre 2026  
* **Versión:** 1.0 (Editable / Actualizable)

---

## 1. Introducción y Metodología de Estimación

El presente documento detalla la estimación económica y el presupuesto integral para el desarrollo de la plataforma web **D10S Cup**. 

El cálculo se rige bajo la metodología estandarizada definida en el proyecto, la cual vincula el costo de vida mensual promedio del desarrollador, el valor horario con margen de rentabilidad, la descomposición de tareas técnicas (modelado de base de datos, CRUDs, frontend, e-commerce y pruebas) y la consolidación entre los integrantes del equipo.

### Flujo Metodológico de Cálculo

```
+------------------------------------+
|    Calcular Gastos Mensuales (C_M) |
|    (Alquiler, Comida, Transporte,  |
|    Ropa y Servicios)               |
+-----------------+------------------+
                  |
                  v
+-----------------+------------------+
|    Calcular Valor Hora (V_H)       |
|    V_H = (C_M / 160) * 1.20        |
+-----------------+------------------+
                  |
                  v
+-----------------+------------------+
|    Listar Tareas Técnicas          |
|    Estimar horas (BD, CRUDs, UI)   |
+-----------------+------------------+
                  |
                  v
+-----------------+------------------+
|    Multiplicar Horas (C_Tarea)     |
|    C_Tarea = H_E * V_H             |
+-----------------+------------------+
                  |
                  v
+-----------------+------------------+
|    Sumar Costos Integrantes        |
|    Consolidación del equipo        |
+-----------------+------------------+
                  |
                  v
+-----------------+------------------+
|   PRESUPUESTO FINAL DEL SISTEMA    |
+------------------------------------+
```

---

## 2. Paso 1 — Costo de Vida Mensual ($C_M$)

El costo de vida mensual representa los gastos mínimos esenciales de un profesional de desarrollo para sostener su actividad mensual completa.

### Fórmula Matemática
$$C_M = A + C + T + R + S$$

Donde:
* **$C_M$**: Costo mensual total estimado.
* **$A$**: Alquiler y expensas de vivienda/oficina.
* **$C$**: Comida y canasta alimentaria mensual.
* **$T$**: Transporte y movilidad.
* **$R$**: Ropa e indumentaria.
* **$S$**: Servicios básicos e insumos tecnológicos (Electricidad, Gas, Agua, Conectividad a Internet de alta velocidad).

### Tabla de Gastos Mensuales Estimados (Valores de Referencia en ARS)

> **Nota para el equipo:** Estos valores reflejan una canasta de gastos base de referencia. Pueden ser ajustados según la realidad económica o requerimientos del curso.

| Variable | Concepto | Detalle / Observación | Monto Estimado (ARS) |
| :--- | :--- | :--- | :--- |
| **$A$** | Alquiler y Expensas | Vivienda / Espacio de trabajo compartido | $ 300.000,00 |
| **$C$** | Comida y Alimentación | Compras mensuales de supermercado y alimentos frescos | $ 200.000,00 |
| **$T$** | Transporte | Viáticos mensuales, transporte público o combustible | $ 45.000,00 |
| **$R$** | Ropa e Indumentaria | Calzado y vestimenta básica mensual prorrateada | $ 35.000,00 |
| **$S$** | Servicios | Internet simétrico 300 Mbps, luz, gas, agua, telefonía | $ 60.000,00 |
| **TOTAL** | **$C_M$ (Costo Mensual)** | **Suma total de gastos de subsistencia mensual** | **$ 640.000,00** |

---

## 3. Paso 2 — Valor de la Hora Laboral ($V_H$)

Para determinar el costo horario del desarrollador, se toma como referencia una jornada laboral estándar completa de **40 horas semanales** (160 horas al mes), incorporando un **margen de ganancia o beneficio técnico del 20% (factor 1.20)** para contemplar amortización de equipos, imprevistos y rentabilidad.

### Fórmula Matemática
$$V_H = \left(\frac{C_M}{160}\right) \times 1.20$$

Donde:
* **$V_H$**: Valor por hora laboral de desarrollo.
* **$C_M$**: Costo de vida mensual ($ 640.000,00 ARS).
* **$160$**: Total de horas laborables mensuales ($40\text{ h/semana} \times 4\text{ semanas}$).
* **$1.20$**: Coeficiente de margen de ganancia del 20%.

### Cálculo Aplicado
1. Costo base por hora:  
   $$\frac{C_M}{160} = \frac{\$ 640.000,00}{160} = \$ 4.000,00\text{ ARS/hora}$$

2. Aplicación de ganancia (+20%):  
   $$V_H = \$ 4.000,00 \times 1.20 = \mathbf{\$ 4.800,00\text{ ARS/hora}}$$

---

## 4. Paso 3 — Desglose de Tareas y Estimación de Horas ($C_{\text{Tarea}}$)

El costo de cada tarea o módulo se calcula multiplicando el esfuerzo en horas estimadas ($H_E$) por el valor de la hora laboral ($V_H$).

### Fórmula Matemática
$$C_{\text{Tarea}} = H_E \times V_H$$

A continuación se detalla la Estructura de Desglose de Trabajo (WBS) adaptada a los requerimientos funcionales y de persistencia de **D10S Cup**:

| Módulo / Tarea | Descripción Técnica | $H_E$ (Horas) | $V_H$ (ARS/h) | $C_{\text{Tarea}}$ Subtotal (ARS) |
| :--- | :--- | :---: | :---: | :---: |
| **M1: Modelado y Base de Datos (MySQL)** | Diseño de diagramas E-R y relacional. Creación de tablas (`usuarios`, `torneos`, `equipos`, `jugadores`, `partidos`, `resultados`, `productos`, `pedidos`, `tickets`). Definición de claves foráneas, índices y scripts de inicialización. | 32 h | $ 4.800 | $ 153.600,00 |
| **M2: CRUD de Usuarios y Autenticación** | Registro e Inicio de sesión para Equipos y Aficionados (`incioSesion.html`, `Registrarse.html`). Hashing seguro de contraseñas. Recuperación de contraseñas (`olvidastecontra.html`). Control de roles y sesiones (Admin, Equipos, Aficionados). | 36 h | $ 4.800 | $ 172.800,00 |
| **M3: CRUD de Torneos** | Módulo de gestión y visualización de torneos (`torneos.html`). Alta, edición y finalización de torneos. Filtros dinámicos por modalidad (Fútbol 11, Fútbol 8, Fútbol 5). Búsqueda predictiva y cupos de inscripción. | 28 h | $ 4.800 | $ 134.400,00 |
| **M4: CRUD de Equipos y Jugadores** | Inscripción formal de equipos en torneos. Carga de escudos/logos. Registro de lista de buena fe (plantel de jugadores con DNI, número y posición). Validación administrativa de inscripciones. | 34 h | $ 4.800 | $ 163.200,00 |
| **M5: CRUD de Partidos y Fixture** | Programación de calendario de partidos (`partidos.html`). Asignación de fecha, horario y cancha/estadio. Carrusel de próximos partidos y vista de calendario mensual de encuentros. | 30 h | $ 4.800 | $ 144.000,00 |
| **M6: Carga de Resultados y Estadísticas** | Módulo de resultados (`Resultados.html`). Carga arbitral de goles, tarjetas amarillas/rojas y asistencias. Cálculo automático de tablas de grupos (PJ, PG, PE, PP, GF, GC, DIF, PTS) y bracket de fase eliminatoria (cuartos, semis, final). | 42 h | $ 4.800 | $ 201.600,00 |
| **M7: E-commerce (Tienda de Entradas e Indumentaria)** | Catálogo interactivo (`productos.html`). Filtros por categorías (Entradas oficiales, Camisetas, Shorts, Gorras). Carrito de compras deslizante (offcanvas), cálculo dinámico de subtotales, stock en tiempo real y emisión de tickets con código único / QR. | 48 h | $ 4.800 | $ 230.400,00 |
| **M8: Panel Administrativo y Reportes** | Dashboard para el Administrador del torneo. Métricas de recaudación por ventas, cantidad de equipos participantes, control de usuarios y reportes exportables. | 26 h | $ 4.800 | $ 124.800,00 |
| **M9: Frontend, UI/UX y Responsive Design** | Maquetación web con HTML5 semántico, variables CSS personalizadas, diseño responsive adaptable a móviles y tablets. Componentes interactivos en JavaScript vanilla (carruseles, modales, menú hamburguesa). | 40 h | $ 4.800 | $ 192.000,00 |
| **M10: Pruebas (QA), Seguridad y Despliegue** | Pruebas de integración, validaciones de formularios, prevención de inyecciones SQL/XSS, configuración de servidor web y despliegue inicial en entorno productivo. | 24 h | $ 4.800 | $ 115.200,00 |
| **TOTALES** | **Esfuerzo global del proyecto de software** | **340 h** | — | **$ 1.632.000,00** |

---

## 5. Paso 4 — Presupuesto Total del Sistema ($P_{\text{Total}}$)

### Fórmula Matemática
$$P_{\text{Total}} = \sum C_{\text{Tareas}}$$

El presupuesto total de desarrollo del software asciende a la suma de los costos de todas las tareas y módulos analizados:

$$P_{\text{Desarrollo Directo}} = \mathbf{\$ 1.632.000,00\text{ ARS}}$$

---

## 6. Consolidación y Distribución por Integrantes

El equipo de trabajo está integrado por cuatro desarrolladores. A continuación se presenta el esquema de distribución y asignación estimada de esfuerzo de trabajo:

| Integrante | Rol Asignado | Módulos Asignados | Horas ($H_E$) | Monto Consolidado (ARS) |
| :--- | :--- | :--- | :---: | :---: |
| **Huechepan Santiago** | Backend & Database Lead | M1 (Base de Datos MySQL) + M2 (Auth y Usuarios) + M10 (Seguridad/QA) | 85 h | $ 408.000,00 |
| **Marteniuk Ignacio** | Core Competitions Dev | M3 (CRUD Torneos) + M4 (Equipos y Jugadores) + M8 (Panel Admin) | 85 h | $ 408.000,00 |
| **Namuncura Joaquín** | Fixture & Stats Specialist | M5 (Partidos y Fixture) + M6 (Resultados y Tablas/Bracket) + Soporte M9 | 85 h | $ 408.000,00 |
| **Enzo Patiño** | E-commerce & Frontend Lead | M7 (Tienda y Carrito de Compras) + M9 (Frontend UI/UX y Responsive) | 85 h | $ 408.000,00 |
| **TOTALES EQUIPO** | **Equipo de 4 Desarrolladores** | **Cobertura 100% de la plataforma D10S Cup** | **340 h** | **$ 1.632.000,00** |

---

## 7. Costos Adicionales de Infraestructura (Opcionales / Recomendados)

Para la puesta en marcha en la nube de la plataforma web con base de datos en línea, se prevén los siguientes costos fijos anuales o mensuales de infraestructura:

| Concepto | Proveedor / Servicio | Periodicidad | Monto Estimado |
| :--- | :--- | :---: | :---: |
| **Dominio Web (.com.ar / .com)** | NIC Argentina / Proveedor oficial | Anual | $ 15.000,00 ARS |
| **Hosting VPS / Base de Datos MySQL** | DonWeb / DigitalOcean / Vercel + Railway | Mensual | $ 18.000,00 ARS |
| **Certificado de Seguridad SSL** | Let's Encrypt | Anual | Gratuito ($ 0,00) |
| **Comisión de Pasarela de Pago** | Mercado Pago / Checkout API | Por transacción | Variable (según ventas) |

---

## 8. Resumen Ejecutivo del Presupuesto

* **Total Horas de Ingeniería de Software:** 340 horas hombre.  
* **Valor Hora Aplicado:** $ 4.800,00 ARS.  
* **Costo Total de Mano de Obra y Desarrollo:** **$ 1.632.000,00 ARS**  
* **Tiempo Estimado de Entrega:** 8 a 10 semanas (con dedicación compartida del equipo).  
* **Condiciones de Pago Sugeridas:**  
  * 30% al inicio del proyecto (Aprobación de relevamiento y modelado de Base de Datos).  
  * 30% a la entrega del Módulo de Torneos, Partidos y Resultados.  
  * 40% a la entrega final, pruebas integradas y despliegue del sistema completo.

---

> 📌 **Guía de Actualización:** Si los valores de gastos mensuales ($A, C, T, R, S$) o las horas por módulo varían durante el ciclo de vida del proyecto, únicamente se debe reemplazar el valor en la tabla del **Paso 1** y re-calcular el **Paso 2**, actualizándose automáticamente las cifras finales del presupuesto.
