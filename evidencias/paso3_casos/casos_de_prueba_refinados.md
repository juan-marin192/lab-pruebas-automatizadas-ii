# Casos refinados — StockPascual

Se generaron 37 casos concretos. Requisito mínimo cumplido:

- 15 o más funcionales: cumple.
- 5 o más negativos o validación: 8 casos.
- 3 o más seguridad/roles: 5 casos.
- 2 o más integridad entre movimiento, stock y dashboard: 4 casos.
- 1 E2E de negocio: TC-E2E-01.

La matriz completa editable está en `casos_de_prueba_refinados.csv`, compatible con Excel. También se entrega `casos_de_prueba_refinados.xlsx`.

## Casos frontera agregados

| Caso | Valor frontera | Resultado esperado |
|---|---|---|
| TC-OUT-02 | OUT igual al stock | Resultado 0, sin permitir valor negativo |
| TC-ALERT-01 | stock = minStock | El producto aparece en alertas |
| TC-MOV-01 | cantidad = 0 | Se rechaza la cantidad |
| TC-PROD-05 | precio = -1 | Se rechaza el precio negativo |
| TC-ADJ-02 | ADJUST con cantidad cero | No permite stock negativo y sigue la regla definida para ajuste físico cero |

Nota: TC-ADJ-02 exige confirmar con el PO si el ajuste a cero debe permitirse. Para la implementación actual, la cantidad cero no es aceptada por la validación general.

## Ocho casos primeros para Playwright

1. **TC-AUTH-01**: verifica inicio y navegación; base de todos los demás escenarios.
2. **TC-PROD-01**: cubre el formulario principal y la persistencia del producto.
3. **TC-OUT-01**: riesgo P0 que impide un stock negativo.
4. **TC-ADJ-01**: riesgo P0 de integridad entre conteo físico y stock.
5. **TC-DASH-01**: detecta rápidamente el cálculo incorrecto del valor.
6. **TC-CSV-01**: valida todos los registros y la exportación.
7. **TC-ROLE-01**: controla la creación por operador, incluyendo seguridad.
8. **TC-E2E-01**: integra creación, movimientos, alerta, dashboard y exportación.
