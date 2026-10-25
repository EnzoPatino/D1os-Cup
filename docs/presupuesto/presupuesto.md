# D10S Cup — Presupuesto estimado de desarrollo

**Taller de Construcción de Software · 2026 · Versión 2.0**
Equipo: Santiago Huechepan · Ignacio Marteniuk · Joaquín Namuncura · Enzo Patiño

> Documento académico de estimación. Los importes en ARS se conservan del ejemplo del proyecto y no constituyen cotización comercial ni precios de mercado actualizados. El presupuesto describe el alcance originalmente estimado; la columna de observaciones identifica módulos implementados parcialmente o pendientes.

## 1. Criterio de cálculo

Se conserva el método de referencia: costo mensual de vida (CM), dividido por 160 horas y multiplicado por un factor de 1,20.

`CM = A + C + T + R + S = ARS 640.000`
`Valor hora = (640.000 / 160) × 1,20 = ARS 4.800/h`
`Costo de tarea = horas estimadas × ARS 4.800`

Los componentes usados son alquiler/expensas 300.000; alimentación 200.000; transporte 45.000; ropa 35.000; servicios 60.000 ARS mensuales. Son supuestos de referencia heredados del material base y requieren actualización antes de cualquier uso comercial.

## 2. Desglose estimado

| Módulo | Horas | Costo (ARS) | Estado frente al sistema actual |
|---|---:|---:|---|
| M1. Modelado y base de datos | 32 | 153.600 | Implementado con Supabase/PostgreSQL; la propuesta original mencionaba MySQL. |
| M2. Usuarios y autenticación | 36 | 172.800 | Registro, login, sesión y recuperación conectados a Supabase Auth. |
| M3. Torneos | 28 | 134.400 | Consulta, filtros y alta administrativa; no CRUD completo. |
| M4. Equipos y jugadores | 34 | 163.200 | Esquema y controles parciales; inscripción y gestión integral pendientes. |
| M5. Partidos y fixture | 30 | 144.000 | Consulta de partidos y calendario conectados. |
| M6. Resultados y estadísticas | 42 | 201.600 | Tablas y eliminatorias consultan datos; carga arbitral no incluida. |
| M7. Tienda y pedidos | 48 | 230.400 | Catálogo, variantes, stock, pedidos, pago simulado y QR de entradas. |
| M8. Panel y reportes | 26 | 124.800 | No implementado como dashboard/reportes. |
| M9. Interfaz y responsive | 40 | 192.000 | Interfaz web HTML/CSS/JS; alcance representado en pantallas existentes. |
| M10. QA, seguridad y despliegue | 24 | 115.200 | RLS y flujos documentados; despliegue requiere configuración final. |
| **Total** | **340** | **1.632.000** | **Estimación del alcance completo propuesto.** |

## 3. Distribución de referencia

La distribución original asigna 85 horas a cada integrante, equivalente a ARS 408.000 por persona y ARS 1.632.000 para el equipo. Es una distribución presupuestaria igualitaria, no una medición del aporte individual real ni una declaración de autoría exclusiva. Para la presentación, el reparto de exposición del documento 04 es una propuesta operativa y puede ajustarse al trabajo efectivamente realizado.

## 4. Costos externos no incluidos

Dominio, hosting/servicios de base de datos, comisiones de pago, correo transaccional, soporte, mantenimiento y actualizaciones de infraestructura. La estimación heredada menciona como referencias ARS 15.000 anuales de dominio y ARS 18.000 mensuales de hosting; deben considerarse valores históricos/no verificados, no una cotización actual. SSL se presupuestó como gratuito. Las cuotas y límites de proveedores pueden cambiar.

## 5. Exclusiones y supuestos

- El pago de la aplicación está simulado: no incluye integración ni comisiones de pasarela real.
- No incluye lector operativo de QR, operación arbitral en vivo ni soporte 24/7.
- No se fija un precio actual de Vercel/Supabase; depende de plan, uso, región y fecha.
- La cifra total corresponde al alcance propuesto completo, no al costo comprobado de lo ya construido.
- Las horas y montos deben recalcularse con el equipo y con costos vigentes antes de presentar una oferta comercial.

## 6. Resumen

**340 horas · ARS 4.800 por hora · ARS 1.632.000 de desarrollo estimado.** El presupuesto es una base de planificación académica en pesos argentinos, con supuestos explícitos y módulos pendientes identificados.
