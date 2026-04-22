import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getTopicResource, getTopicsCatalogResource } from "../domain/studyService.js";

function buildJsonResource(uri, payload) {
  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(payload, null, 2)
      }
    ]
  };
}

export function registerStudyResources(server) {
  server.registerResource(
    "topics-catalog",
    "study://topics",
    {
      title: "Study topics catalog",
      description: "Full catalog of study topics available in the local knowledge base.",
      mimeType: "application/json"
    },
    async () => {
      return buildJsonResource("study://topics", getTopicsCatalogResource());
    }
  );

  server.registerResource(
    "topic-detail",
    new ResourceTemplate("study://topics/{topic}", {
      list: async () => {
        const catalog = getTopicsCatalogResource();

        return {
          resources: catalog.topics.map((topic) => ({
            uri: `study://topics/${topic.id}`,
            name: topic.title,
            description: topic.summary,
            mimeType: "application/json"
          }))
        };
      }
    }),
    {
      title: "Study topic detail",
      description: "Detailed content for a single study topic.",
      mimeType: "application/json"
    },
    async (uri, variables) => {
      return buildJsonResource(uri.toString(), getTopicResource(variables.topic));
    }
  );
}
