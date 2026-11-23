# Notas sobre la salida de IA

Comparamos la respuesta cruda (`Riesgos_IA_crudo.md`) contra lo que observamos en StockPascual.

1. **Subestimó el XSS**: el riesgo 12 (campos de texto ejecutados como script) quedó en último lugar, con impacto "Bajo". En la app, un nombre con `<img src=x onerror=alert(1)>` sí ejecuta código en el selector de movimientos (TC-XSS-01, BUG-10). Es el criterio de aceptación 10 y debe ser P0/P1 por seguridad.
2. **Quedó demasiado genérica en autenticación**: el riesgo 11 habla de "credenciales o sesiones expuestas" y "token débil", sin ninguna prueba ligada a un requisito. Lo concreto es: sin token responde 401 (TC-AUTH-04) y el operador recibe 403 al crear, editar o eliminar productos (TC-ROLE-01 a 03).
3. **Inventó una regla que no está en los requisitos**: el riesgo 9 supone una regla de "productos inactivos o eliminados" que afecta las métricas, pero `Requisitos_StockPascual_MVP.md` solo pide mostrar "productos activos". Es un riesgo especulativo y no debe competir con el Top 5.
4. **Subestimó la integridad al eliminar**: el riesgo 7 (movimientos huérfanos) quedó en el puesto 7, fuera del Top 5. Al eliminar un producto con movimientos, estos siguen apareciendo como "(producto eliminado)" (BUG-05), lo que afecta la trazabilidad en una auditoría.
