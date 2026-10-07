# Part 2: Order Skill

**Time:** 10 minutes. **File to create:** `srv/orders-assistant/skills/order-management/SKILL.md`

## Goal
Build on the Part 1 service by giving the future CAP agent order-handling instructions. The skill does not change how the service works on its own.

## What Is a Skill?
A skill is a Markdown document for an AI agent, not code that CAP executes. It uses plain language because the model reads it to decide how to handle a request: which tools to call, what to ask the user, and how to answer. The YAML block at the top gives the skill a name and describes when it is relevant; the rest is guidance the model can follow, not a guarantee. CAP still executes the tool calls and enforces roles.

In Part 3 you will create the agent and an `AGENTS.md` file telling it to use this `order-management` skill. Only then can you try these instructions in the browser chat. Copilot's MCP connection from Part 1 does not automatically use this skill.

## Create the Skill
Create the `skills/order-management/` directory inside `srv/orders-assistant/`, then add `SKILL.md` there. Here is an example you can adapt:

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

The headings group the rules for the model. `createOrder` and `requestApproval` name real CAP actions from Part 1; the sentences around them describe when the agent should call them. You can change the wording and compare the result in Part 3.

## Try It
Run `npm run check:skill` to check the most important text rules. This does not test an AI response. Part 3 activates the agent; afterward try "Create an order" and "Create a 25,000 EUR order for Example Co" at `/a2a/orders-assistant/preview/`. Confirm tool calls and status in CAP, not just the model's wording. Replies may vary.

## Think About It
The skill guides the model. CAP enforces the role for `approveOrder`, but the 10,000 EUR threshold is not yet a hard server rule. Where would you put it to apply to *every* client? The shared handler in `srv/order-operations.ts` serves both OData and MCP. A server rule would need to define a clear status transition rather than require an unnecessary second action after order creation.

## Help
Compare your skill with the completed example under `parts/2-skill/solution/`.