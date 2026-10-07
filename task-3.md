# Part 3: Agent Instructions and Order Skill

**Time:** 10 minutes. **Files to create:** `srv/orders-assistant/AGENTS.md` and `srv/orders-assistant/skills/order-management/SKILL.md`

## Goal
The agent from Part 2 can already use CAP tools. Now give it a general role and a focused order workflow. These Markdown files are instructions for the model, not executable CAP rules or new permissions.

## What Changes?
Without `AGENTS.md`, the agent card advertises capabilities generated from the CDS entity and actions. With `AGENTS.md` beside the service, `@cap-js/agents` builds a Markdown-based agent that reads those general instructions. It discovers skills in the adjacent `skills/` directory and shows their frontmatter names and descriptions in the card. The card does not show their full instructions or prove the model followed them.

## Write Agent Instructions
Create `srv/orders-assistant/AGENTS.md` (plural). This file describes the agent's role and points it to the order-management skill:

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

## Write the Skill
A skill is a plain-language Markdown workflow the agent can consult when it is relevant to a request. Its frontmatter `name` identifies it and `description` tells the agent when to use it. Create `srv/orders-assistant/skills/order-management/SKILL.md`:

```md
---
name: order-management
description: Use for questions about orders and for creating, requesting approval, or cancelling orders.
---

# Order Management

## Approval rule

- For orders above 10,000 EUR, call `createOrder`, then `requestApproval` with the new order number.
- For orders of 10,000 EUR or less, create the order without requesting approval.

## Restrictions

- Never approve an order yourself; only an authorized person can do that outside the agent.
- Cancel an order only when explicitly asked.

## Workflow

- Read existing orders with `query`; use tool results for status and amounts.
- Ask for a missing customer or amount instead of inventing one.

## Response style

- Answer in English in at most three sentences, including the order number when available.
- Format amounts like `12,500.00 EUR`.
```

The action names refer to tools from Part 1. CAP still executes their calls and enforces roles; the 10,000 EUR threshold here is model guidance, not a server-side rule for every client.

## Try It
Run `npm run check:skill` to check the key text rules (not a model test). Restart CAP, then compare `/a2a/orders-assistant/.well-known/agent-card.json` with the Part 2 card. Look for `orders-assistant` and `order-management` instead of the CDS-generated action list.

Start a new conversation at `/a2a/orders-assistant/preview/` and create a 25,000 EUR order for Example Co. Check that CAP called `createOrder` and `requestApproval` and that the order is `PENDING_APPROVAL`; do not rely on the reply alone. If the model fails after a write, check CAP before retrying. Copilot uses MCP with its own model and does **not** automatically load this agent's skill, so its response may differ.

## Think About It
Why does a card listing `order-management` not prove that the model followed the skill? Where would you enforce the approval threshold for *every* client? The shared CAP handler in `srv/order-operations.ts` is one place to consider.

## Help
Compare your files with the completed examples under `parts/3-instructions/solution/`. If the card still lists the CDS actions, confirm the file is named `AGENTS.md` and restart CAP.