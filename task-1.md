# Part 1: CAP Service via MCP

**Time:** 10 minutes. **Files to create:** `srv/orders-assistant/service.cds`, `srv/orders-assistant/service.ts`, `.mcp.json`

## Goal
The starting CAP app exposes only the Orders OData API. Add a separate, focused service for AI clients. `@cap-js/mcp` turns its entity and actions into the `describe`, `query`, and `call` tools.

## Build the Service
Create `srv/orders-assistant/service.cds` and build it in the following steps.

### Reuse the Order Data
Start with an import of the existing model:

```cds
using { workshop as db } from '../../db/schema';
```

`workshop` is the namespace in the database schema. The alias `db` lets you write `db.Orders` below; the service reuses that entity rather than creating another table. The relative path goes from `srv/orders-assistant/` to `db/`.

### Expose a Focused Service
Add the MCP annotation and a service with room for the entity and actions:

```cds
@mcp: '/mcp/orders-assistant'
service OrdersAssistantService {
}
```

`@mcp` makes this service available at `/mcp/orders-assistant`. Try leaving it out temporarily: CAP then shows this service through its default OData endpoint. Put `@mcp` back before the MCP check. The original Orders OData API stays available either way.

### Make Orders Readable
Between the service braces, add a projection of the existing orders:

```cds
/** Read orders and their current status before answering questions. */
@readonly entity Orders as projection on db.Orders;
```

`@readonly` lets clients query orders but not update this entity directly. The `/** ... */` comment describes the entity to an MCP client through `describe`; try changing its wording and inspecting the result.

### Add Controlled Actions
Still inside the service, add the actions for changing an order:

```cds
/** Create an order for a named customer and a positive amount in EUR. */
action createOrder(customer : String, amount : Decimal(15, 2)) returns Orders;

/** Request approval for an existing order in status NEW. */
action requestApproval(orderNo : Integer) returns Orders;

/** Cancel an existing order in status NEW or PENDING_APPROVAL. */
action cancelOrder(orderNo : Integer) returns Orders;
```

Each action declares its inputs and returns an `Orders` result. MCP's generic `call` tool invokes the actions; `query` reads orders; `describe` lists them with their `/** ... */` comments. Try rewording one action comment and calling `describe` again. These descriptions guide clients but do not enforce business rules: the supplied handler performs the changes. Do **not** add `approveOrder`: approval itself is outside this workshop.

Your service should now look something like this:

```cds
using { workshop as db } from '../../db/schema';

@mcp: '/mcp/orders-assistant'
service OrdersAssistantService {
	/** Read orders and their current status before answering questions. */
	@readonly entity Orders as projection on db.Orders;

	/** Create an order for a named customer and a positive amount in EUR. */
	action createOrder(customer : String, amount : Decimal(15, 2)) returns Orders;

	/** Request approval for an existing order in status NEW. */
	action requestApproval(orderNo : Integer) returns Orders;

	/** Cancel an existing order in status NEW or PENDING_APPROVAL. */
	action cancelOrder(orderNo : Integer) returns Orders;
}
```

## Add the Supplied Handler
Create `srv/orders-assistant/service.ts` with the following code. It reuses the existing CAP order operations; the model connection is used only when Part 2 enables the agent.

```ts
import cds from '@sap/cds'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import registerOrderActions from '../order-operations'

export default class OrdersAssistantService extends cds.ApplicationService {
	init() {
		registerOrderActions(this)
		this.on('buildModel', () => new ChatGoogleGenerativeAI({
			model: cds.env.requires.llm.model,
			maxRetries: 0,
			apiKey: process.env.GEMINI_API_KEY
		}))
		return super.init()
	}
}
```

## Connect Copilot
Create `.mcp.json` in the workspace root with this local-only connection.

```json
{
	"mcpServers": {
		"orders-cap": {
			"type": "http",
			"url": "http://localhost:4004/mcp/orders-assistant"
		}
	}
}
```

Use port 4004 for CAP, or adjust both this URL and `CAP_URL` for the checker if you use another port.

## Try It
Start `npm run cap` in one terminal, then run `npm run check:mcp` in another. The check reads order 1001, creates a test order, requests approval, and confirms no approve action is exposed. It does not require Copilot or `.mcp.json`.

Open Copilot Chat in VS Code Agent mode. Trust the local MCP server and inspect its tools. Ask: "Which orders are waiting for approval?" or "Create a 250 EUR order for Example Co." Review write tool calls before accepting them.

## Think About It
How do the MCP actions differ from the original OData API? Why is requesting approval different from approving an order?

## Help
Compare your files with the completed example under `parts/1-mcp/solution/`.