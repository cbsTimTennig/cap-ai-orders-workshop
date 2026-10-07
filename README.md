# CAP AI Orders Workshop

Build an AI assistant for a CAP Orders application in three steps: connect Copilot through MCP, write an order-management skill, and try a CAP agent in the browser. Start with [Part 1](task-1.md).

## Getting Started

The distributed project starts with only the Orders CAP service. Codespaces installs dependencies automatically; for local setup, use Node.js 22+ and run:

```text
npm ci
npm run cap
```

In Codespaces, run `npm run cap` once the setup finishes.

Open the CAP URL shown in the terminal (normally `http://localhost:4004`), then follow the guides in order:

1. [Part 1: CAP service via MCP](task-1.md) - create the service and connect Copilot.
2. [Part 2: Order skill](task-2.md) - write the rules that guide the agent.
3. [Part 3: CAP agent](task-3.md) - enable the browser chat and try the skill.

Continue directly to the next guide; each part builds on the files you created earlier. Each guide includes its own checks. Completed examples are available under `parts/`.

## What You Need

- For Part 1: VS Code with GitHub Copilot Chat in Agent mode and permission to use workspace MCP servers.
- For Part 3: a separate Gemini API key. Copy `.env.example` to `.env`, set `GEMINI_API_KEY`, and restart CAP (or use a Codespaces secret). Your Copilot login is not a Gemini key. Never commit the key or put it in the browser.

This workshop uses mock users and an in-memory database. Restarting CAP resets test orders; the local mock authentication is not suitable for production.