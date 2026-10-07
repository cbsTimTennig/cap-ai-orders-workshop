# Part 2: CAP Agent and Second Client

**Time:** 10 minutes. **File to create:** `srv/orders-assistant/agent.cds`

## Goal
Expose the Part 1 service as an agent and try it in the browser. `@cap-js/agents` supplies the chat loop and uses the service's entity and actions as tools.

## Add the Agent
Create `srv/orders-assistant/agent.cds`:

```cds
using { OrdersAssistantService } from './service';

annotate OrdersAssistantService with @agent: '/a2a/orders-assistant';
```

The `using` line refers to the service from Part 1; it does not create another service. The annotation exposes it over A2A without changing its CAP actions or authorization. With no `AGENTS.md` yet, the package builds an agent from the CDS service description and tools.

## Connect the Model
The browser agent needs a Gemini API key in addition to your Copilot login. Copy `.env.example` to `.env`, set `GEMINI_API_KEY`, and restart CAP with `npm run cap`.

## Try It
Open `/a2a/orders-assistant/preview/` on CAP port 4004, keeping the trailing slash so mock authentication survives redirects. Ask about order 1001, then create an order for Example Co. Follow the tool calls in the CAP console and check the actual order in CAP rather than trusting only the reply (hallucinations).

Open `/a2a/orders-assistant/.well-known/agent-card.json`. Its `skills` list is generated from the service's entity and actions (such as `query` and `createOrder`): these are advertised A2A capabilities, not instructions from a `SKILL.md` file. Save what you see to compare with Part 3. Copilot still connects to the MCP service with its own model; the browser uses your separately configured Gemini model.

## Think About It
Why can the browser use the service without a custom chat loop? Does seeing a tool listed on the agent card tell you when the agent should call it? What might change when you give the agent written instructions in Part 3?

## Help
Compare your annotation with the completed example under `parts/2-agent/solution/`. If the browser has no model response, check CAP logs and confirm that `GEMINI_API_KEY` is available to the CAP process.