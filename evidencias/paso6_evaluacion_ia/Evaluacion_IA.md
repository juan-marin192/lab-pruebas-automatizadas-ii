# Evaluación crítica del uso de IA — Laboratorio Pruebas Automatizadas II + IA

Completar y guardar en `evidencias/paso6_evaluacion_ia/`. Al final, copiar la versión definitiva a `entrega/05_evaluacion_ia.md`.

## 1. Prompts clave utilizados

Pegar 2 o 3 prompts usados, o indicar qué archivos de `/prompts` se adaptaron:

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

## 4. Riesgos o bugs que la IA no vio y el equipo sí encontró

- 1. **Gravedad del contexto institucional:**
No dimensionó el impacto legal y administrativo que tiene para Recursos Físicos del Pascual Bravo un reporte en CSV incompleto durante una auditoría universitaria.
- 2. **Flujos complejos de UI combinados:**
No contempló la desincronización que ocurre al ejecutar múltiples movimientos `OUT` simultáneos desde pestañas o usuarios distintos.

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
La capacidad del ingeniero de QA para cuestionar los requisitos, comprender la operación física del almacén universitario, validar los hallazgos en la aplicación en vivo y descartar falsos positivos. La estrategia idónea para la universidad es implementar un enfoque **AI-Assisted QA**, donde el profesional de calidad utiliza la IA para automatizar tareas repetitivas y acelerar la documentación, pero mantiene el control absoluto sobre la validación, la exploración y la toma de decisiones.
