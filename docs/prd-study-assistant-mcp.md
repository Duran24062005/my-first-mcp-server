# PRD: Study Assistant MCP

## Problema y objetivo
Quiero un proyecto pequeño que permita aprender los fundamentos de un servidor MCP sin depender de APIs externas ni de reglas de negocio complejas.
El objetivo es tener un ejemplo ejecutable que muestre cómo exponer `tools` y `resources` con validación, respuestas claras y una estructura de código fácil de seguir.

## Alcance del MVP
- Transporte HTTP con `StreamableHTTPServerTransport`
- Dominio simple de estudio con temas locales
- Tres `tools` de solo lectura
- Dos `resources` de solo lectura
- Validaciones explícitas y errores previsibles
- Documentación práctica para ejecutar, probar y extender el ejemplo
- Prueba de humo para verificar arranque, tools y resources

## Conceptos MCP cubiertos
- Bootstrap de un servidor MCP
- Registro de `tools`
- Registro de `resources` fijos y por plantilla
- Validación de entrada con `zod`
- Lectura de recursos desde el cliente MCP
- Separación entre protocolo, dominio y datos

## Decisiones técnicas
- JavaScript ESM para mantener la curva de entrada baja
- HTTP solamente en esta primera iteración
- Dataset local en memoria cargado desde un módulo estático
- Servidor stateless para reducir complejidad inicial
- Cliente de prueba usando el SDK oficial de MCP

## Usuarios / actores
- Persona que está aprendiendo MCP desde cero
- Desarrollador que quiere un ejemplo pequeño para extender luego

## Impacto en datos, contratos e integraciones
- No hay persistencia ni integraciones externas
- El contrato público se limita a:
  - `list_topics()`
  - `get_topic_summary({ topic })`
  - `search_topics({ query })`
  - recurso catálogo `study://topics`
  - recurso detalle `study://topics/{topic}`

## Reglas y validaciones
- `topic` debe existir en el dataset local
- `query` no puede ir vacía
- Los parámetros inválidos deben devolver error de tool o resource legible
- El servidor es estrictamente de solo lectura

## Riesgos y límites intencionales
- No cubre prompts, sampling ni tasks
- No cubre autenticación ni despliegue
- No cubre escritura ni sincronización con sistemas externos
- No busca ser “production-ready”; busca ser entendible
