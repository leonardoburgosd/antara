# Flujo de desarrollo (Development Workflow)

Flujo obligatorio para toda funcionalidad nueva o cambio significativo, en cualquier plataforma.

## Flujo

1. **Analizar el requerimiento**
   - Comprender el objetivo y el valor.
   - Identificar plataformas afectadas (Desktop, Mobile, Web o las tres).
   - Determinar si es funcionalidad **global** (común) o **específica** de una plataforma.
   - Identificar funcionalidades existentes relacionadas (evitar duplicar o romper).

2. **Consultar `docs/implementation-instructions.md`**
   - Seguir el procedimiento de 7 pasos de ese documento.
   - Consultar los documentos globales indicados (arquitectura, principios, estructura, estándares, diseño, API, errores, pruebas).

3. **Consultar las instrucciones específicas de la plataforma**
   - Desktop: [`apps/desktop/docs/implementation-instructions.md`](../apps/desktop/docs/implementation-instructions.md).
   - Mobile: [`apps/mobile/docs/implementation-instructions.md`](../apps/mobile/docs/implementation-instructions.md).
   - Web: documentación global + revisar la estructura existente de `apps/web/`.
   - Si la feature toca un comportamiento protegido (tray, reproducción en segundo plano, MediaSession, permisos, consistencia visual), consultar el documento especializado (tabla en [implementation-instructions.md](implementation-instructions.md#funcionalidades-obligatorias)).

4. **Revisar la arquitectura existente**
   - Leer los módulos implicados antes de escribir código.
   - Verificar si ya existe un componente/servicio/hook equivalente (reutilizar si aporta).
   - Confirmar el estado actual del código afectado (no asumir que lo descrito en docs ya está implementado).

5. **Identificar los módulos afectados**
   - Listar archivos a crear/modificar por plataforma.
   - Detectar impacto en funcionalidades existentes y en la consistencia entre plataformas.

6. **Definir contratos y responsabilidades**
   - Tipos/DTOs/entidades de la feature.
   - Firma de servicios/repositorios/comandos.
   - Estados de la funcionalidad (loading/empty/error/success; estados del reproductor si aplica).
   - Efectos secundarios previstos (red, permisos, ciclo de vida) y cómo se contienen.
   - Considerar accesibilidad y responsive design desde el inicio.

7. **Implementar**
   - Respetando [coding-standards.md](coding-standards.md), [design-system.md](design-system.md), [responsive-design.md](responsive-design.md) y los estándares específicos de la plataforma.
   - Sin crear estructuras alternativas sin justificación técnica documentada.

8. **Ejecutar pruebas**
   - Según [testing-strategy.md](testing-strategy.md) y los `testing.md` de plataforma.
   - Compilar no es suficiente: probar estados, errores y navegación.

9. **Verificar consistencia visual**
   - Checklist de [ui-consistency.md](ui-consistency.md#cómo-revisar-consistencia).
   - Revisar en las tres plataformas afectadas y en las regiones/breakpoints relevantes.

10. **Actualizar documentación**
    - Nuevas decisiones → [`decisions/README.md`](decisions/README.md).
    - Nuevas dependencias, patrones o comportamientos → documentos afectados (globales o específicos).
    - Cambios en funcionalidades protegidas → documento especializado correspondiente.

11. **Verificar que no se han roto funcionalidades existentes**
    - Pruebas existentes en verde.
    - Smoke test del flujo crítico (login → biblioteca → reproducción, según alcance).
    - Revisar regresiones visuales en pantallas cercanas al cambio.

## Reglas de ejecución

- **Nunca** se salta el Paso 2/3: sin consultar documentación, no se escribe código.
- Si la implementación **contradice** una instrucción documentada: **detenerse**, explicar la contradicción y proponer una solución antes de introducir una nueva convención (ver [implementation-instructions.md](implementation-instructions.md#regla-de-contradicción)).
- Los cambios que toquen funcionalidades protegidas (System Tray, Background Playback, MediaSession, permisos Android, tokens visuales) requieren justificación técnica explícita en la descripción del cambio.
- Commits pequeños y enfocados; mensajes que expliquen el *por qué*.

## Definición de terminado (DoD)

Una feature está terminada cuando:

- [ ] Implementada en todas las plataformas exigidas (o excepción documentada en [`decisions/README.md`](decisions/README.md)).
- [ ] Sigue estándares de código, estructura y design system.
- [ ] Estados loading/empty/error cubiertos.
- [ ] Pruebas mínimas de [testing-strategy.md](testing-strategy.md) en verde.
- [ ] Consistencia visual verificada.
- [ ] Accesibilidad y responsividad verificadas.
- [ ] Sin regresiones en flujos existentes.
- [ ] Documentación actualizada.
