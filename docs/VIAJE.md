# El viaje empieza acá

Experiencia independiente en [`/viaje.html`](../viaje.html). La homepage y `/reserva.html` se conservan.

- `CONFIG` es la única fuente de escenas, contacto y unidades.
- Las unidades usan únicamente nombres, año, kilometraje y carrocería presentes en el catálogo existente.
- El vehículo arrastrable es un token abstracto de marca; no se inventan ilustraciones de modelos.
- Las capas de escena usan planos cromáticos sólidos porque el repositorio solo contiene placeholders “FOTO A CARGAR”; no se muestran como fotografías reales hasta recibir assets verificados del local.
- El estado único es `progress` de 0 a 1: drag, wheel y teclado convergen en él.
- El control es un slider accesible y existe una alternativa lineal “Ver todas las unidades”.
- `prefers-reduced-motion` elimina parallax e inercia sin ocultar contenido.
- `?debug=1` activa un medidor FPS básico solo durante auditoría.
- No se afirman horarios, disponibilidad ni promesas técnicas.
- El WhatsApp queda marcado como dato pendiente de confirmar con el cliente.
