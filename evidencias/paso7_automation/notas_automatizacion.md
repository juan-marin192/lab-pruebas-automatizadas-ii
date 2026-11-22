# Automatizacion E2E — StockPascual

## Flujo cubierto

El test `stockpascual-smoke.spec.ts` inicia sesion como admin, crea un producto con SKU basado en timestamp, registra IN de 5 y OUT de 4, verifica stock final 1 y confirma que aparece en Alertas con minimo 2. Conserva tambien las pruebas smoke de dashboard admin y controles de operador.

La corrida guarda una captura de la vista de alertas en `e2e_stock_bajo.png`.

## Tres riesgos de flakiness

1. **Datos compartidos y variables**: el servidor mantiene datos en memoria; otras ejecuciones pueden cambiar stocks, movimientos o productos mientras corre el test.
2. **Carga asincrona de la interfaz**: el refresh despues de guardar o registrar movimientos lanza varias peticiones; los asserts deben esperar el estado observable, no pausas fijas.
3. **Datos dinamicos y colisiones**: un SKU generado debe ser suficientemente unico para evitar que ejecuciones paralelas intenten crear el mismo producto.

## Aserciones que no se deben inventar

- No asumir un toast o mensaje de exito: la interfaz no muestra uno al guardar o registrar movimientos.
- No afirmar el texto exacto de un error de validacion si el flujo probado no provoca ese error ni se observó en el DOM.
- No asumir que el dashboard muestra un total exacto, ni que el CSV contiene el producto: esos son comportamientos defectuosos ya identificados y no forman parte del objetivo de este E2E.
- El test verifica el stock desde la columna observada en la tabla de Productos y presencia del SKU en Alertas; no presupone roles ARIA adicionales no definidos por la interfaz.
