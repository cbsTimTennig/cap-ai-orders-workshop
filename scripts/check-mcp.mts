import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

const base = process.env.CAP_URL ?? 'http://localhost:4004'
const client = new Client({ name: 'workshop-check', version: '1.0.0' })
let failed = false
const check = (ok: boolean, message: string) => {
  console.log(`${ok ? 'OK' : 'FAIL'} ${message}`)
  if (!ok) failed = true
}

try {
  await client.connect(new StreamableHTTPClientTransport(new URL('/mcp/orders-assistant', base)))

  const names = (await client.listTools()).tools.map(tool => tool.name)
  check(['describe', 'query', 'call'].every(name => names.includes(name)), 'CAP MCP tools available')

  const describe = await client.callTool({ name: 'describe', arguments: {} })
  const actions = Object.keys((describe.structuredContent as { actions?: Record<string, unknown> } | undefined)?.actions ?? {})
  check(actions.includes('createOrder') && actions.includes('requestApproval') && !actions.includes('approveOrder'), 'Only allowed actions described')

  const order = await client.callTool({ name: 'query', arguments: { cql: 'SELECT from Orders { orderNo, customer } WHERE orderNo = 1001' } })
  check((order.structuredContent as { data?: { orderNo: number }[] } | undefined)?.data?.[0]?.orderNo === 1001, 'Order 1001 read')

  let rejected = false
  try {
    const result = await client.callTool({ name: 'call', arguments: { action: 'approveOrder', parameters: { orderNo: 1002 } } })
    rejected = !!result.isError || !(result.structuredContent as { result?: unknown } | undefined)?.result
  } catch {
    rejected = true
  }
  check(rejected, 'Approval unavailable through generic call too')

  const created = await client.callTool({ name: 'call', arguments: { action: 'createOrder', parameters: { customer: 'Check Co', amount: 12500 } } })
  const orderNo = (created.structuredContent as { result?: { orderNo: number } } | undefined)?.result?.orderNo
  check(!created.isError && Number.isInteger(orderNo), 'Order created')
  if (orderNo) {
    const approval = await client.callTool({ name: 'call', arguments: { action: 'requestApproval', parameters: { orderNo } } })
    check((approval.structuredContent as { result?: { status: string } } | undefined)?.result?.status === 'PENDING_APPROVAL', 'Approval requested')
  }
} catch (error) {
  check(false, `${error instanceof Error ? error.message : String(error)} (is npm run cap running?)`)
} finally {
  await client.close()
}

process.exitCode = failed ? 1 : 0