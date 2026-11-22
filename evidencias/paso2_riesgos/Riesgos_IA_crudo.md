# Análisis de riesgos - StockPascual

## Supuestos

- El piloto se limita al MVP descrito y no incluye integración con compras, ERP, lectores de código de barras ni auditoría externa.
- Los datos iniciales representan un inventario pequeño y pueden contener cambios hechos durante el piloto.
- Las pruebas compararán el stock del sistema con conteos físicos controlados y documentos institucionales.
- Se considera impacto de negocio Alto cuando puede impedir entregas, distorsionar decisiones financieras o causar incumplimiento/auditoría.
- Impacto técnico puede ser menor aunque el impacto de negocio sea Alto.

## Tabla de riesgos (Top 12)

| Orden | Impacto de negocio | Probabilidad | Riesgo | Módulo | Severidad técnica vs. negocio | Ideas de prueba |
|---|---|---|---|---|---|---|
| 1 | Alto | Alta | OUT permite llevar el stock negativo, dejando inventario físico y salidas a laboratorios inconsistentes | Movimientos | Técnica Media-Alta; negocio Alto | Con un producto de 3 unidades, registrar OUT de 10 y verificar rechazo más stock sin cambios. Repetir con OUT exactamente igual al stock y verificar que quede en cero. |
| 2 | Alto | Alta | ADJUST suma la cantidad contada en vez de fijar el stock al conteo físico | Movimientos / Integridad | Técnica Media-Alta; negocio Alto | Con stock conocido 22, registrar ADJUST 5 y verificar stock final 5, no 27. Confirmar movimiento y stock tras recargar la página. |
| 3 | Alto | Alta | El dashboard divide el valor del inventario entre 1000 | Dashboard / Reporting | Técnica Media; negocio Alto | Calcular Σ(stock × precio) de los datos iniciales y compararlo con el dashboard; luego cambiar precio o stock y verificar que el total sea exacto. |
| 4 | Alto | Alta | La exportación omite los últimos dos productos y no protege nombres o campos con caracteres especiales | Exportación / Auditoría | Técnica Media-Alta; negocio Alto | Crear o usar una cantidad mayor de productos y verificar que el CSV contiene todos; incluir comillas o comas en nombre/categoría y validar formato CSV. |
| 5 | Alto | Alta | El sistema acepta SKU duplicado, precio, stock o stock mínimo negativo | Productos / Datos | Técnica Media-Alta; negocio Alto | Crear dos productos con el mismo SKU y verificar rechazo. Probar precio=-100, stock=-5 y minStock=-1 en creación y edición. |
| 6 | Alto | Media | El operador podría intentar alterar productos desde la API aunque la interfaz lo oculte | Seguridad / Roles | Técnica Alta; negocio Alto | Usando el token del operador, intentar POST, PUT y DELETE de productos y verificar 403 sin cambios. Comparar con el comportamiento del admin. |
| 7 | Alto | Media | Eliminar un producto deja movimientos huérfanos que muestran inventario o trazabilidad incompleta | Productos / Movimientos | Técnica Media; negocio Alto | Crear, mover y eliminar un producto; consultar movimientos y verificar que no quede una referencia no controlada ni reporte contradictorio. |
| 8 | Medio | Alta | La búsqueda distingue mayúsculas y puede ocultar productos al usuario | Productos / Usabilidad | Técnica Media; negocio Medio | Buscar `mouse`, `MOUSE`, `CAB` y comparar nombres/SKU; verificar coincidencias parciales sin distinguir mayúsculas. |
| 9 | Medio | Media | Los productos inactivos o eliminados pueden afectar conteos si la regla de activo no coincide con las métricas esperadas | Productos / Dashboard | Técnica Media; negocio Medio | Cambiar activo y recargar dashboard; comprobar si activos, bajo stock, agotados y valor siguen una definición consistente. |
| 10 | Medio | Media | Las alertas pueden evaluar stock de forma inconsistente si aceptan activos, ceros o mínimos negativos | Alertas / Datos | Técnica Media; negocio Medio | Definir stock igual al mínimo y verificar alerta; probar stock menor, mayor y cero con mínimos válidos. |
| 11 | Medio | Media | Credenciales o sesiones podrían quedar expuestas por una autenticación insuficiente o token débil | Autenticación / Seguridad | Técnica Alta; negocio Medio-Alto | Ejecutar casos sin token, con token falso y con token de otro rol; verificar 401/403 y que no se alteren datos sin permisos. |
| 12 | Bajo | Media | Campos de texto podrían ejecutarse como scripts o romperse al mostrarse | Seguridad / XSS / Usabilidad | Técnica Media-Alta; negocio Bajo-Medio | Crear nombre o ubicación con `<script>alert(1)</script>` y verificar que se muestre como texto, no se ejecuta ni cambia el diseño. |

## Top 5 para el piloto

### 1. OUT permite stock negativo
Impide confiar en el inventario físico y puede autorizar conceptualmente entregas imposibles. Es frecuente en operaciones reales y tiene una prueba directa.

Por eso es P0: una sola salida excesiva puede deshacer el control de stock para uno o varios laboratorios.

### 2. ADJUST no fija el stock al conteo físico
El ajuste debería sustituir el stock anterior, pero actualmente lo suma. Una diferencia de conteo puede ampliarse y generar nuevas diferencias.

Es P0 porque ataca directamente la causa de confianza en el almacén: reconciliar el físico con el sistema.

### 3. Dashboard calcula un valor incorrecto
Divide el valor de inventario por 1000, por lo que los reportes administrativos no representan el dinero real asociado a los insumos.

Es P0 para auditoría y decisiones de compra; puede detectarse en minutos usando datos conocidos.

### 4. Exportación CSV incompleta
Omite los dos últimos productos y puede perder información crítica para auditoría o reconciliación externa.

Es P1/P0 cuando se usa como respaldo institucional: el CSV debe contener exactamente el inventario visible.

### 5. Datos de producto inválidos o SKU duplicado
Precios negativos, stocks negativos o SKU repetidos distorsionan stock, valor y trazabilidad.

Es P1/P0: la integridad debe protegerse al ingresar datos antes de que errores se propaguen al dashboard y al CSV.
