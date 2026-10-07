# Part 3: CAP Agent and Second Client

**Time:** 10 minutes. **Files to create:** `srv/orders-assistant/agent.cds` and `srv/orders-assistant/AGENTS.md`

## Goal
`@cap-js/agents` creates an agent with tool use and a ReAct loop from the CAP service. Your `AGENTS.md` and the Part 2 skill guide its behavior. CAP exposes an A2A endpoint and a ready-made chat preview.

## Task
Create `srv/orders-assistant/agent.cds`:

```cds
using { OrdersAssistantService } from './service';

annotate OrdersAssistantService with @agent: '/a2a/orders-assistant';
```

The `using` line refers to the service you built in Part 1; it does not create a second service. The annotation tells `@cap-js/agents` to expose that service as an agent at the A2A path. Its existing orders and actions become the agent's tools, while the CAP service still handles their execution and authorization. This is why you do not have to write a chat loop yourself.

Create `srv/orders-assistant/AGENTS.md` to describe how the agent should behave. Unlike the CDS annotation, these plain-language instructions guide the model rather than change the service. For example:

```md
---
name: orders-assistant
version: 1.0.0
description: Helps customers find, create, and request approval for workshop orders.
---

# Orders Assistant

You help users manage orders through the OrdersAssistantService tools.
Read order data before stating facts about existing orders. Ask for a customer and
amount if either is missing before creating an order. Never claim you can approve
an order: approval belongs to an authorized employee outside this agent.
Use the order-management skill for the approval workflow and response style.
```

Start `npm run cap` with your own Gemini key set as `GEMINI_API_KEY` in local `.env` or a Codespaces secret.

## Try It
Open `/a2a/orders-assistant/preview/` on CAP port 4004 (keep the trailing slash to retain authentication through redirects). Ask about order 1001, then create an order for 25,000 EUR and follow the `describe`, `query`, and `call` calls in the CAP console. Compare the same request in VS Code Copilot: Copilot is an external MCP client with its own model; the browser preview talks to the CAP agent over A2A, using the separately configured Gemini model. Copilot does **not** automatically load the CAP agent skill, so its handling of the 10,000 EUR rule may differ. Check the order and status in CAP, not just the response text.

## Think About It
Why does the browser need no custom agent loop? Why would a Teams client require a separate integration instead of reusing the browser page? `@agent.hitl` requests user confirmation *before* a tool call; it is not the business approval status of an order.

## Help
Compare your agent annotation with the completed example under `parts/3-agent/solution/`. If the browser preview has no model response, check CAP logs and verify that `GEMINI_API_KEY` is present in the CAP process; your Copilot login does not replace it.
If a response stops after `createOrder`, check the order and status through OData before submitting the request again. A client timeout does not undo completed CAP actions.