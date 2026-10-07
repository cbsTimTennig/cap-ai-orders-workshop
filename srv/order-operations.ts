import cds from '@sap/cds'

export default function registerOrderActions(service: cds.ApplicationService): void {
  const { Orders } = cds.entities('workshop')

  const load = async (orderNo: number) => {
    const order = await SELECT.one.from(Orders).where({ orderNo })
    if (!order) cds.error({ status: 404, message: `Order ${orderNo} not found` })
    return order
  }

  const transition = async (orderNo: number, from: string[], to: string) => {
    const order = await load(orderNo)
    if (!from.includes(order.status))
      cds.error({ status: 409, message: `Order ${orderNo} has status ${order.status}; allowed statuses: ${from.join(', ')}` })
    await UPDATE(Orders).set({ status: to }).where({ orderNo })
    return load(orderNo)
  }

  service.on('createOrder', async (req) => {
    const { customer, amount } = req.data
    if (!customer || !(amount > 0)) return req.reject(400, 'Customer and a positive amount are required')
    const { max } = await SELECT.one.from(Orders).columns('max(orderNo) as max')
    const orderNo = (max ?? 1000) + 1
    await INSERT.into(Orders).entries({ orderNo, customer, amount, status: 'NEW' })
    return load(orderNo)
  })

  service.on('requestApproval', (req) => transition(req.data.orderNo, ['NEW'], 'PENDING_APPROVAL'))
  service.on('cancelOrder', (req) => transition(req.data.orderNo, ['NEW', 'PENDING_APPROVAL'], 'CANCELLED'))
  if (service.name === 'OrdersService')
    service.on('approveOrder', (req) => transition(req.data.orderNo, ['PENDING_APPROVAL'], 'APPROVED'))
}