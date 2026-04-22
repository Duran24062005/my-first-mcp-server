import { createApp } from "./server/createApp.js";

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "127.0.0.1";

const app = createApp();

app.listen(port, host, (error) => {
  if (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }

  console.log(`Study Assistant MCP listening on http://${host}:${port}/mcp`);
});
