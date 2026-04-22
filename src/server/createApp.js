import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { createStudyServer } from "./createStudyServer.js";

function getAllowedHosts() {
  const configuredHosts = (process.env.ALLOWED_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);

  if (configuredHosts.length > 0) {
    return [...new Set(configuredHosts)];
  }

  return undefined;
}

function getAppOptions() {
  const isVercelRuntime = process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
  const allowedHosts = getAllowedHosts();

  if (isVercelRuntime) {
    return {
      host: "0.0.0.0",
      allowedHosts
    };
  }

  return {
    host: process.env.HOST ?? "127.0.0.1",
    allowedHosts
  };
}

export function createApp() {
  const app = createMcpExpressApp(getAppOptions());

  app.get("/", (_req, res) => {
    const isVercelRuntime = process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);

    res.json({
      name: "study-assistant-mcp",
      status: "ok",
      message: "Study Assistant MCP server is running.",
      endpoints: {
        mcp: "/mcp"
      },
      hostValidation: {
        mode: isVercelRuntime ? "vercel-runtime" : "localhost-default",
        allowedHosts: getAllowedHosts() ?? (isVercelRuntime ? "all hosts allowed unless ALLOWED_HOSTS is set" : ["localhost", "127.0.0.1", "[::1]"])
      }
    });
  });

  app.post("/mcp", async (req, res) => {
    const server = createStudyServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("Failed to handle MCP request:", error);

      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "Internal server error"
          },
          id: null
        });
      }
    } finally {
      await transport.close().catch(() => {});
      await server.close().catch(() => {});
    }
  });

  app.get("/mcp", async (_req, res) => {
    res.status(405).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed."
      },
      id: null
    });
  });

  app.delete("/mcp", async (_req, res) => {
    res.status(405).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed."
      },
      id: null
    });
  });

  return app;
}
