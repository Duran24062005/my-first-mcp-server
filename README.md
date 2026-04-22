# study-assistant-mcp

Servidor MCP mínimo por HTTP para aprender los conceptos básicos de `tools` y `resources` con un dominio sencillo de estudio.

## Qué enseña este proyecto
- cómo arrancar un servidor MCP por HTTP
- cómo registrar `tools`
- cómo registrar `resources`
- cómo validar entradas con `zod`
- cómo separar el protocolo de la lógica del dominio
- cómo probar un servidor MCP con un cliente del SDK

## Estructura
- `src/index.js`: punto de entrada del servidor HTTP
- `src/server/createApp.js`: app Express y endpoint `/mcp`
- `src/server/createStudyServer.js`: instancia `McpServer` y registro de capacidades
- `src/tools/`: definición de tools
- `src/resources/`: definición de resources
- `src/domain/`: lógica del dominio de estudio
- `src/data/topics.js`: dataset local de ejemplo
- `docs/prd-study-assistant-mcp.md`: documento de planificación
- `test/server.test.js`: prueba de humo end-to-end

## Requisitos
- Node.js 18 o superior

## Instalar dependencias
```bash
npm install
```

## Ejecutar el servidor
```bash
npm start
```

Por defecto levanta en `http://127.0.0.1:3000`.

Variables opcionales:
- `PORT`: puerto HTTP
- `HOST`: host de bind, por defecto `127.0.0.1`
- `ALLOWED_HOSTS`: lista separada por comas para permitir hosts adicionales

Notas de despliegue:
- En Vercel se permite automáticamente `VERCEL_URL` para evitar errores de `Invalid Host`.
- Si usas dominio propio u otro proxy, define `ALLOWED_HOSTS=tu-dominio.com,otro-host.com`.

Rutas disponibles:
- `/`
  Respuesta JSON simple para confirmar que el servicio está arriba.
- `/mcp`
  Endpoint MCP principal.

## Qué expone el servidor

### Tools
- `list_topics()`
  Lista los temas disponibles.
- `get_topic_summary({ topic })`
  Devuelve el resumen y metadatos de un tema.
- `search_topics({ query })`
  Busca coincidencias en título, resumen, conceptos clave y contenido.

### Resources
- `study://topics`
  Catálogo completo de temas.
- `study://topics/{topic}`
  Contenido detallado de un tema específico.

## Cómo probarlo
```bash
npm test
```

La prueba:
- crea un cliente y un servidor MCP enlazados en memoria
- lista tools
- ejecuta cada tool principal
- lee el catálogo de resources
- lee un resource por tema
- verifica errores básicos

La capa HTTP sigue siendo la interfaz pública del proyecto y se valida manualmente con `npm start`. En este repositorio la prueba automatizada usa transporte en memoria para evitar depender de permisos de red del entorno donde corra el test.

## Cómo extenderlo

### Añadir una nueva tool
1. Crea la lógica en `src/domain/studyService.js` si hace falta.
2. Regístrala en `src/tools/registerStudyTools.js`.
3. Define su `inputSchema` y devuelve `content` legible.
4. Si devuelves datos estructurados, inclúyelos en `structuredContent`.
5. Añade una prueba en `test/server.test.js`.

### Añadir un nuevo resource
1. Define cómo obtener sus datos desde el dominio.
2. Regístralo en `src/resources/registerStudyResources.js`.
3. Usa una URI estable y clara.
4. Añade una prueba de lectura del resource.

## Notas didácticas
- El dataset es local para que el foco esté en MCP, no en infraestructura.
- El servidor es stateless para evitar sesiones y reducir ruido conceptual.
- No hay mutaciones ni auth en esta versión.
