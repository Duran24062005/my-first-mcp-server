export const topics = [
  {
    id: "javascript",
    title: "JavaScript Fundamentals",
    summary: "Variables, functions, objects, arrays and async basics used in everyday JavaScript.",
    difficulty: "beginner",
    keywords: ["javascript", "variables", "functions", "objects", "async"],
    content: [
      "JavaScript is a programming language used in browsers, servers and tools.",
      "Core building blocks include variables, functions, arrays, objects and control flow.",
      "Modern JavaScript also relies heavily on promises and async or await for asynchronous work."
    ]
  },
  {
    id: "mcp",
    title: "MCP Basics",
    summary: "The Model Context Protocol lets applications expose tools, resources and prompts to LLM clients.",
    difficulty: "beginner",
    keywords: ["mcp", "tools", "resources", "prompts", "protocol"],
    content: [
      "An MCP server exposes capabilities in a standard format so clients can discover and use them.",
      "Tools are for actions or computations, while resources provide read-only context.",
      "A transport such as stdio or Streamable HTTP moves JSON-RPC messages between client and server."
    ]
  },
  {
    id: "http",
    title: "HTTP Essentials",
    summary: "HTTP is a request and response protocol used to move data between clients and servers.",
    difficulty: "beginner",
    keywords: ["http", "request", "response", "headers", "status"],
    content: [
      "HTTP uses methods such as GET and POST to express intent.",
      "Each response includes a status code, headers and often a body.",
      "MCP can run over HTTP transports so clients can communicate with remote servers."
    ]
  },
  {
    id: "testing",
    title: "Testing Basics",
    summary: "Tests verify behavior, reduce regressions and document expected system outcomes.",
    difficulty: "beginner",
    keywords: ["testing", "assertions", "regression", "integration", "unit"],
    content: [
      "Unit tests focus on small pieces of logic in isolation.",
      "Integration tests verify that modules work together correctly.",
      "A small smoke test is often enough to validate an educational example end to end."
    ]
  }
];
