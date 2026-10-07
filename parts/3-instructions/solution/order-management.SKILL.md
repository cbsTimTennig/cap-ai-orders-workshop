---
name: order-management
description: Use for questions about orders and for creating, requesting approval, or cancelling orders.
---

# Order Management

## Approval rule

- Orders above 10,000 EUR need approval: call `createOrder`, then immediately call `requestApproval` with the new order number.
- Orders of 10,000 EUR or less stay in status NEW.

## Restrictions

- Never approve an order yourself; an authorized person must do this outside the agent.
- Cancel an order only when explicitly asked.

## Workflow

- State statuses and amounts only from tool results; use `query` to check existing orders.
- Ask for a customer or amount when missing instead of inventing values.
- Explain tool errors rather than blindly repeating a call.

## Response style

- Answer in English in at most three sentences and include the order number when available.
- Format amounts as `12,500.00 EUR`.