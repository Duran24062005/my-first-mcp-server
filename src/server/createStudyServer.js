import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerStudyResources } from "../resources/registerStudyResources.js";
import { registerStudyTools } from "../tools/registerStudyTools.js";

export function createStudyServer() {
  const server = new McpServer({
    name: "study-assistant-mcp",
    version: "1.0.0"
  });

  registerStudyTools(server);
  registerStudyResources(server);

  return server;
}
