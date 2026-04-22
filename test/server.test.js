import test from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createStudyServer } from "../src/server/createStudyServer.js";

test("study assistant mcp exposes tools and resources", async () => {
  const server = createStudyServer();
  const client = new Client({
    name: "study-assistant-test-client",
    version: "1.0.0"
  });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  try {
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport)
    ]);

    const toolsResult = await client.listTools();
    const toolNames = toolsResult.tools.map((tool) => tool.name).sort();
    assert.deepEqual(toolNames, ["get_topic_summary", "list_topics", "search_topics"]);

    const listTopicsResult = await client.callTool({
      name: "list_topics",
      arguments: {}
    });
    assert.ok(!listTopicsResult.isError);
    assert.match(listTopicsResult.content[0].text, /javascript/);

    const summaryResult = await client.callTool({
      name: "get_topic_summary",
      arguments: { topic: "mcp" }
    });
    assert.ok(!summaryResult.isError);
    assert.match(summaryResult.content[0].text, /MCP Basics/);

    const searchResult = await client.callTool({
      name: "search_topics",
      arguments: { query: "http" }
    });
    assert.ok(!searchResult.isError);
    assert.match(searchResult.content[0].text, /http/);

    const invalidSummary = await client.callTool({
      name: "get_topic_summary",
      arguments: { topic: "unknown-topic" }
    });
    assert.equal(invalidSummary.isError, true);
    assert.match(invalidSummary.content[0].text, /was not found/);

    const invalidSearch = await client.callTool({
      name: "search_topics",
      arguments: { query: "" }
    });
    assert.equal(invalidSearch.isError, true);
    assert.match(invalidSearch.content[0].text, /Input validation error/);

    const resourcesResult = await client.listResources();
    const resourceUris = resourcesResult.resources.map((resource) => resource.uri).sort();
    assert.deepEqual(resourceUris, [
      "study://topics",
      "study://topics/http",
      "study://topics/javascript",
      "study://topics/mcp",
      "study://topics/testing"
    ]);

    const catalogResource = await client.readResource({
      uri: "study://topics"
    });
    assert.match(catalogResource.contents[0].text, /totalTopics/);

    const detailResource = await client.readResource({
      uri: "study://topics/mcp"
    });
    assert.match(detailResource.contents[0].text, /MCP Basics/);

    await assert.rejects(
      client.readResource({
        uri: "study://topics/unknown-topic"
      }),
      /was not found/
    );
  } finally {
    await client.close().catch(() => {});
    await server.close().catch(() => {});
  }
});
