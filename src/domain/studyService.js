import { topics } from "../data/topics.js";

function normalizeSearchValue(value) {
  return String(value ?? "").trim().toLowerCase();
}

function formatTopicPreview(topic) {
  return {
    id: topic.id,
    title: topic.title,
    summary: topic.summary,
    difficulty: topic.difficulty,
    keywords: topic.keywords
  };
}

function formatTopicDetail(topic) {
  return {
    ...formatTopicPreview(topic),
    content: topic.content
  };
}

function buildSearchBlob(topic) {
  return [topic.id, topic.title, topic.summary, topic.keywords.join(" "), topic.content.join(" ")].join(" ").toLowerCase();
}

export function listTopics() {
  return topics.map(formatTopicPreview);
}

export function getTopicById(topicId) {
  const normalizedTopicId = normalizeSearchValue(topicId);

  if (!normalizedTopicId) {
    throw new Error("The 'topic' parameter is required.");
  }

  const topic = topics.find((entry) => entry.id === normalizedTopicId);

  if (!topic) {
    throw new Error(`Topic '${topicId}' was not found. Try one of: ${topics.map((entry) => entry.id).join(", ")}.`);
  }

  return formatTopicDetail(topic);
}

export function searchTopics(query) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    throw new Error("The 'query' parameter must contain a non-empty search term.");
  }

  return topics
    .filter((topic) => buildSearchBlob(topic).includes(normalizedQuery))
    .map((topic) => ({
      id: topic.id,
      title: topic.title,
      summary: topic.summary,
      difficulty: topic.difficulty,
      matchedKeywords: topic.keywords.filter((keyword) => keyword.toLowerCase().includes(normalizedQuery))
    }));
}

export function getTopicsCatalogResource() {
  return {
    generatedAt: new Date().toISOString(),
    totalTopics: topics.length,
    topics: listTopics()
  };
}

export function getTopicResource(topicId) {
  return getTopicById(topicId);
}
