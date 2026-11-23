# Pitch — Laboratorio Pruebas Automatizadas II + IA (5 minutos)

**Equipo:** María Fernanda Holguín Hernández (**M**) y Juan José Marín Monsalve (**J**)
**App evaluada:** StockPascual (inventarios, Institución Universitaria Pascual Bravo)

> Cada sección indica quién habla, cuánto dura, qué decir y qué mostrar. Los tiempos suman 5:00.
> Los textos son una guía: cada quien debe decirlo con sus palabras y poder explicar sus puntos.

| # | Sección | Quién | Tiempo |
|---|---------|-------|--------|
| 1 | Contexto y cómo trabajamos | M | 0:30 |
| 2 | Riesgos priorizados (Top 5) | M | 0:40 |
| 3 | Casos de prueba y ejecución | J | 0:40 |
| 4 | Bugs: datos y validación | M | 0:45 |
| 5 | Bugs: movimientos, reportes y seguridad | J | 0:55 |
| 6 | Automatización con Playwright | J | 0:40 |
| 7 | Uso de la IA: qué acertó y qué no | M | 0:40 |
| 8 | Conclusión y cierre | M + J | 0:10 |

---

## 1. Contexto y cómo trabajamos — **M** (0:30)

**Decir:**
- Somos QA junior del piloto de StockPascual. El almacén del Pascual Bravo pasó de Excel a esta app, y el problema era la confianza en el stock y en el valor del inventario.
- Seguimos el ciclo completo: riesgos con IA, casos, ejecución y exploración, reporte de bugs, evaluación de la IA y automatización E2E con Playwright.
- Regla del equipo: la IA propone, nosotros validamos en la app. Un bug solo cuenta si lo reprodujimos con pasos y captura.

**Mostrar:** `README.md` o el árbol de `entrega/`.

---

## 2. Riesgos priorizados (Top 5) — **M** (0:40)

**Decir (uno por frase, por impacto en el almacén):**
1. **OUT deja stock negativo:** se entregan insumos que no existen.
2. **ADJUST suma en vez de fijar:** el conteo físico queda mal después de ajustar.
3. **Dashboard divide por 1000:** el valor del inventario no es confiable para decidir.
4. **CSV incompleto:** una auditoría pierde registros.
5. **SKU duplicado y valores negativos:** los datos inválidos se propagan a todo lo demás.

**Mostrar:** `entrega/01_top5_riesgos.xlsx`.
**Cierre de la sección:** "La IA nos dio 12 riesgos y los ordenamos nosotros según el impacto para el almacén."

---

## 3. Casos de prueba y ejecución — **J** (0:40)

**Decir:**
- Diseñamos **37 casos** con datos concretos (SKU, precios en COP, cantidades). Cubren autenticación, productos, validación, movimientos, dashboard, alertas, exportación, roles, XSS y 1 E2E.
- Ejecutamos **10 casos P0**: **7 fallaron** y **3 pasaron** (login admin, login operador y rol de operador).
- Hicimos una **exploración de 25 minutos** con la misión "credibilidad del dashboard y CSV". Ahí confirmamos el valor dividido por 1000 (2.586.200 COP reales contra 2.586,2 en pantalla) y el CSV con 3 filas de 5 productos.

**Mostrar:** `entrega/03_matriz_ejecucion.xlsx` y `evidencias/paso4_ejecucion/exploracion_guiada.md`.

---

## 4. Bugs: datos y validación — **M** (0:45)

Resumen: de los **11 bugs** confirmados, esta parte cubre 6. Todos tienen captura en `evidencias/paso5_bugs/`.

| Bug | Qué pasa | Sev. |
|-----|----------|------|
| BUG-01 | La búsqueda distingue mayúsculas: `MOUSE` da "Sin resultados" y `Mouse` sí encuentra el producto | Media |
| BUG-02 | Se permite SKU duplicado (CAB-USB-01 queda dos veces) | Alta |
| BUG-03 | Se acepta precio negativo al crear | Alta |
| BUG-04 | Solo se valida el nombre: SKU vacío, precio vacío (queda en 0) y stock -5 pasan | Alta |
| BUG-05 | Al eliminar un producto, su movimiento queda como "(producto eliminado)" | Media |
| BUG-11 | Al editar, el precio puede quedar en -$ 5 | Alta |

**Decir:** "Los criterios 2, 3, 5 y 8 de aceptación no se cumplen. La causa común es que el servidor casi no valida lo que recibe."
**Mostrar:** una captura, por ejemplo `bug02_sku_duplicado.png` o `bug05_movimientos_huerfanos.png`.

---

## 5. Bugs: movimientos, reportes y seguridad — **J** (0:55)

| Bug | Qué pasa | Sev. |
|-----|----------|------|
| BUG-06 | OUT de 10 sobre stock 8 deja el stock en -2 | **Crítica** |
| BUG-07 | ADJUST de 5 sobre stock 22 deja 27 en vez de 5 | Alta |
| BUG-08 | Dashboard muestra el valor dividido por 1000 | Alta |
| BUG-09 | El CSV omite los 2 últimos productos (5 productos y 3 filas) y no escapa comas ni comillas | Alta |
| BUG-10 | XSS: un nombre con `<img src=x onerror=alert(1)>` ejecuta código en el selector de movimientos | Alta |

**Decir:**
- BUG-06 es el único crítico: corrompe el stock.
- El rol del operador sí funciona: recibe 403 al intentar crear, editar o eliminar productos.
- BUG-10: la tabla de productos escapa el texto, pero el selector de movimientos usa `innerHTML` sin escapar.

**Mostrar:** `bug06_stock_negativo_out.png` y `bug10_xss_select_movimientos.png`.

---

## 6. Automatización con Playwright — **J** (0:40)

**Decir:**
- El test E2E recorre el flujo de negocio: login admin, crear producto con SKU único, **IN de 5**, **OUT de 4**, verificar stock 1 y comprobar que aparece en **Alertas** con mínimo 2.
- Se corrieron los **3 tests** del archivo (2 smoke y el E2E) y los 3 pasan. El E2E guarda su captura en `evidencias/paso7_automation/`.
- Riesgos de inestabilidad que identificamos: datos en memoria compartidos, esperas por la carga asíncrona y SKU generados que podrían chocar.
- Decisión: no asertamos mensajes que la app no muestra. Tampoco asertamos el valor del dashboard ni el CSV, porque son defectos ya conocidos.

**Mostrar:** `automation/tests/stockpascual-smoke.spec.ts` y la captura `01_playwright_e2e_report.png`.
**Comando para correrlo en vivo (con la app encendida):** `cd automation && npx playwright test`.

---

## 7. Uso de la IA: qué acertó y qué no — **M** (0:40)

**Qué acertó:** estructuró riesgos y casos en segundos, y apuntó a los puntos correctos (OUT negativo, ADJUST, valor, CSV).

**Qué falló o hubo que corregir:**
- **Subestimó el XSS:** lo dejó de último con impacto "Bajo", y en la app sí ejecuta código (BUG-10).
- **Inventó una regla de productos inactivos** que no está en los requisitos.
- **Fue genérica en autenticación** ("token débil", "sesiones expuestas") sin ligarlo a pruebas.
- **No vio** la validación incompleta (BUG-04 y BUG-11).

**Frase de cierre:** "La IA no sabe que un stock en -7 es entregar insumos que no existen."
**Mostrar:** `entrega/05_evaluacion_ia.md`.

---

## 8. Conclusión y cierre — **M + J** (0:10)

- **M:** "Un QA 100% reemplazado por IA no es recomendable."
- **J:** "AI-Assisted QA: la IA acelera, y nosotros validamos, priorizamos y respondemos por el resultado."

---

## Preguntas probables (para prepararlas)

| Pregunta | Quién | Idea de respuesta |
|----------|-------|-------------------|
| ¿Cómo comprobaron que el dashboard "miente"? | J | Calculamos Σ(stock × precio) a mano con los 5 productos: 2.586.200 COP contra 2.586,2 en pantalla. |
| ¿Por qué OUT negativo es crítico y el resto alto? | J | Corrompe el stock físico. Los demás distorsionan datos o reportes, pero no el inventario real. |
| ¿Qué cambiarían primero en la app? | M | Validar en el servidor: SKU único, valores no negativos, OUT que no supere el stock, ADJUST que fije el valor. |
| ¿Qué es el ADJUST correcto? | M | Establece el stock al conteo físico, no lo suma. |
| ¿Qué tan estable es el test E2E? | J | Usa SKU único por ejecución y espera estados visibles, sin pausas fijas. Depende de datos en memoria. |
| ¿Cómo evitaron aceptar bugs falsos de la IA? | M | Cada bug lleva pasos, datos y captura reproducidos en la app; descartamos la MFA por estar fuera del alcance. |
