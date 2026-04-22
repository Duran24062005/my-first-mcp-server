import { z } from "zod";
import { getTopicById, listTopics, searchTopics } from "../domain/studyService.js";

function toTextBlock(text) {
  return {
    type: "text",
    text
  };
}

export function registerStudyTools(server) {
  server.registerTool(
    "list_topics",
    {
      title: "List study topics",
      description: "List all available study topics in the local knowledge base."
    },
    async () => {
      const topics = listTopics();

      return {
        content: [
          toTextBlock(
            topics.length === 0
              ? "No topics are available."
              : `Available topics: ${topics.map((topic) => topic.id).join(", ")}.`
          )
        ],
        structuredContent: {
          totalTopics: topics.length,
          topics
        }
      };
    }
  );

  server.registerTool(
    "get_topic_summary",
    {
      title: "Get topic summary",
      description: "Return the summary and main details for a study topic by id.",
      inputSchema: {
        topic: z.string().trim().min(1).describe("Topic id, for example 'mcp' or 'javascript'.")
      }
    },
    async ({ topic }) => {
      const topicDetail = getTopicById(topic);

      return {
        content: [
          toTextBlock(
            `${topicDetail.title} (${topicDetail.id})\nDifficulty: ${topicDetail.difficulty}\nSummary: ${topicDetail.summary}`
          )
        ],
        structuredContent: {
          topic: topicDetail
        }
      };
    }
  );

  server.registerTool(
    "search_topics",
    {
      title: "Search topics",
      description: "Search study topics by keyword across titles, summaries, keywords and content.",
      inputSchema: {
        query: z.string().trim().min(1).describe("Keyword or phrase to search for.")
      }
    },
    async ({ query }) => {
      const matches = searchTopics(query);

      return {
        content: [
          toTextBlock(
            matches.length === 0
              ? `No study topics matched '${query}'.`
              : `Found ${matches.length} matching topic(s): ${matches.map((topic) => topic.id).join(", ")}.`
          )
        ],
        structuredContent: {
          query,
          totalMatches: matches.length,
          topics: matches
        }
      };
    }
  );
}
