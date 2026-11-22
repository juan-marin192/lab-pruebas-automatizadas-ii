# Notas sobre la salida de IA

1. **Pudo subestimar la autenticación**: el rol operador sí tiene movimientos permitidos; el riesgo relevante es que no pueda crear, editar ni eliminar productos, no prohibirle todos los movimientos.
2. **Pudo quedarse demasiado genérica en seguridad**: nombres como "datos sensibles" o "fallos de sesión" deben convertirse en pruebas concretas con 401/403 y tokens válidos o falsos.
3. **Pudo inventar alcance técnico**: no existe integración ERP, carga masiva, lectores de barras, concurrencia distribuida ni auditoría externa en este MVP; no deben convertirse en riesgos prioritarios del piloto.
