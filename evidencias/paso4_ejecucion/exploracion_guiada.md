# Exploracion guiada — Paso 4

## Misiones propuestas por el prompt

### A. Integridad de stock
- Objetivo: comprobar que entradas, salidas y ajustes conservan una existencia fisica no negativa y consistente.
- Areas: OUT, IN, ADJUST, movimientos y dashboard.
- Datos: stock 3/OUT 10, stock 22/ADJUST 5, OUT igual al stock.
- Fallo: stock negativo, ajuste sumado y movimiento sin correspondencia con el stock.

### B. Credibilidad del dashboard y CSV
- Objetivo: comprobar que las metricas y la exportacion representen exactamente el inventario actual.
- Areas: dashboard, exportacion CSV y comparacion con productos.
- Datos: sum(stock x precio), coma y comillas en textos, cambios temporales de catalogo.
- Fallo: totales divididos o truncados, filas faltantes y campos rotos por separadores.

### C. Abuso de permisos / seguridad basica
- Objetivo: comprobar que el operador no pueda administrar productos ni ejecutar contenido HTML.
- Areas: UI de productos, API por rol y selectores con datos de texto.
- Datos: operador con POST/PUT/DELETE, nombre con `<img src=x onerror=alert(1)>`.
- Fallo: cambios desde operador y ejecucion de script o HTML.

## Mision seleccionada

**B. Credibilidad del dashboard y CSV**.

Se exploraron 5 productos antes del experimento temporal:

- Valor exacto manual: 2.586.200 COP.
- Valor mostrado por dashboard: 2.586.2 COP.
- Stock bajo mostrado: 3.
- Agotados mostrados: 2.
- Movimientos mostrados: 4.

## Experimentos realizados

| Tiempo | Idea probada | Resultado observado | Estado |
|---|---|---|---|
| 00-05 | Calcular Σ(stock × precio) desde los 5 productos y comparar con dashboard | Exacto 2.586.200 COP; dashboard 2.586.2 COP | Bug candidato |
| 05-10 | Contar productos y filas del CSV base | 5 productos; 3 filas de datos | Bug confirmado |
| 10-15 | Crear temporalmente producto con precio 123456 COP, stock 2 y nombre con coma/comillas | Producto creado; nombre: Cable, tipo "M"; categoria con coma | Observado |
| 15-20 | Exportar nuevamente y contar filas | 6 productos conocidos; 4 filas de datos; ultimo temporal omitido | Bug confirmado |
| 20-25 | Revisar si el CSV protege campos con coma o comillas | Categoria y nombre aparecen sin escapado/encapsulado CSV | Bug candidato |

## Hallazgos

1. **BUG-08/credibilidad dashboard**: el dashboard divide el valor del inventario entre 1000.
2. **BUG-09/CSV incompleto**: el exportador omite productos segun el truncado `length - 2`.
3. **CSV sin escape**: nombres y categorias con coma o comillas pueden romper columnas al abrir en Excel.
4. La cuenta de movimientos y categorias de dashboard se alinearon con el estado actual durante la sesion, pero no invalida el error de valor.

## Preguntas

- ¿El valor de inventario debe mostrarse con separador de miles colombiano y sin decimales?
- ¿Los productos activos deben ser la unica fuente del valor y del CSV?
- ¿El CSV debe usar comillas dobles para campos con comas o comillas?

## Riesgo de quedarse sin foco

No seguir con cambios masivos de datos, integraciones ERP o carga masiva. La sesion se mantiene limitada a comparar los 5 productos visibles, el dashboard y el CSV.
