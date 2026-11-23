# Evaluación crítica del uso de IA — Laboratorio Pruebas Automatizadas II + IA

**Equipo:** María Fernanda Holguín Hernández y Juan José Marín Monsalve.

## 1. Prompts clave utilizados

Prompts usados (adaptados de `prompts/01_analisis_riesgos.md`, `02_casos_de_prueba.md` y `03_exploracion_guiada.md`):

1. ### **Prompt 1 (Análisis de Riesgos - Paso 2):**
"Actúa como QA Lead senior. Revisa el documento de Requisitos de StockPascual MVP. Identifica los 10 principales riesgos de calidad ordenados por prioridad (P0, P1, P2), indicando el módulo afectado, el impacto en la operación del almacén de la universidad y una propuesta de mitigación."
2. ### **Prompt 2 (Diseño de Casos de Prueba - Paso 3):**
"Genera una matriz detallada de casos de prueba para el módulo de Movimientos y Productos de StockPascual. Incluye ID, Módulo, Título, Precondiciones, Pasos, Datos de Prueba, Resultado Esperado, Prioridad (P0/P1/P2) y si es Automatizable (Sí/No). Asegúrate de incluir casos negativos como salidas OUT mayores al stock y SKU duplicados."
3. ### **Prompt 3 (Exploración Guiada - Paso 4):**
Genera 3 misiones de exploración para evaluar la integridad del inventario, la seguridad en roles y la consistencia matemática entre los movimientos y el Dashboard en StockPascual."

## 2. Qué acertó la IA

- 1. **Estructuración rápida:**
Generó esqueletos completos de casos de prueba y matrices de riesgo en cuestión de segundos, acelerando la fase inicial de diseño.
- 2. **Identificación de casos límite estándar:**
Sugirió validar entradas negativas en precios/cantidades e inyecciones XSS básicas en campos de texto.
-3. **Misiones de exploración enfocadas:**
Propuso misiones claras para tensionar la consistencia entre los movimientos `ADJUST` y el stock total.

## 3. Qué alucinó o inventó sin evidencia

-1. **Comportamiento del movimiento `ADJUST`:** En los primeros casos sugeridos, la IA asumió que `ADJUST` debía sumar/restar unidades como un movimiento `IN`/`OUT`, en lugar de **establecer el valor absoluto del conteo físico** como exigían los requisitos institucionales.

2. **Prioridad del XSS:** en el análisis de riesgos puso el XSS en el último lugar, con impacto "Bajo". Al probarlo en la app, el nombre `<img src=x onerror=alert(1)>` se ejecuta en el selector de movimientos (BUG-10). Subestimó un criterio de aceptación.
3. **Regla de productos inactivos (riesgo 9):** planteó un riesgo sobre productos "inactivos o eliminados" que no aparece en los requisitos; solo se pide mostrar "productos activos". No lo incluimos en el Top 5.

## 4. Riesgos o bugs que la IA no vio y el equipo sí encontró

- 1. **Gravedad del contexto institucional:**
No dimensionó el impacto legal y administrativo que tiene para Recursos Físicos del Pascual Bravo un reporte en CSV incompleto durante una auditoría universitaria.
- 2. **Validación incompleta del alta y la edición de productos:**
La IA habló de precios y stocks negativos, pero no vio que el servidor solo valida el nombre. Probamos que acepta SKU vacío, precio no numérico (queda `null`) y stock -5 (BUG-04), y que al editar acepta precio -5 (BUG-11).
- 3. **Impacto en la trazabilidad al eliminar productos:**
Al borrar un producto con movimientos, estos quedan como "(producto eliminado)" y sin SKU (BUG-05). La IA lo dejó en el puesto 7 del análisis, fuera del Top 5, sin dimensionar el efecto en auditoría.

## 5. Falsos positivos: la IA dijo “bug” y no lo era

-1. La IA marcó como "Error de Seguridad Crítico" la ausencia de autenticación multifactor (MFA), lo cual es una recomendación pero no un bug dentro del alcance definido para este MVP.

## 6. Momento de mayor valor frente a mayor pérdida de tiempo

| | Descripción |
|--|-------------|
| Mayor valor | Identificación de Fallas y BUGS |
| Mayor pérdida de tiempo | Elaboración de matrices y archivos CSV |

## 7. Reflexión, 10 a 15 líneas

¿Contratar un proceso de QA 100% reemplazado por IA en la Institución Universitaria Pascual Bravo? Argumentar con ejemplos de este laboratorio.

Un equipo de QA compuesto 100% por Inteligencia Artificial **no es viable ni recomendable** para la Institución Universitaria Pascual Bravo. 
Aunque la IA demostró ser un asistente extraordinario para acelerar la redacción de casos de prueba y sugerir listas iniciales de riesgos, carece del **criterio humano, contexto del dominio e intuición técnica** necesarios para validar el software real. 
El criterio humano marcó la diferencia en varios puntos concretos del laboratorio. La IA propuso el análisis de riesgos, pero fue el equipo quien comprobó en la app que el XSS sí se ejecuta, algo que ella había clasificado como riesgo bajo. También fue el equipo quien calculó a mano el valor del inventario (2.586.200 COP) y vio que el dashboard mostraba 2.586,2, quien contó las filas del CSV (5 productos y solo 3 filas) y quien descartó recomendaciones fuera de alcance, como la autenticación multifactor, que no es un bug de este MVP.

La IA tampoco conoce la operación del almacén: no sabe que una salida a un laboratorio que deja el stock en -7 significa entregar insumos que no existen, ni que un CSV incompleto es grave para una auditoría institucional. Además, un bug sugerido por la IA solo cuenta si se reprodujo en la aplicación, con pasos y captura, y eso requiere a una persona que ejecute, observe y decida.

La estrategia adecuada para el Pascual Bravo es **AI-Assisted QA**: la IA acelera la redacción de riesgos, casos y código de Playwright, y el profesional de calidad conserva la validación, la exploración, la priorización y la responsabilidad del resultado. Un QA 100% reemplazado por IA no es recomendable.
