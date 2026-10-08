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