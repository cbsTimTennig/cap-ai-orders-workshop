using { workshop as db } from '../db/schema';

@path: '/odata/v4/orders'
@requires: 'authenticated-user'
service OrdersService {

  @readonly entity Orders as projection on db.Orders;

  action createOrder(customer : String, amount : Decimal(15, 2)) returns Orders;
  action requestApproval(orderNo : Integer)                       returns Orders;
  action cancelOrder(orderNo : Integer)                           returns Orders;

  // Only users with the "approver" role (alice); the agent runs as bob.
  @requires: 'approver'
  action approveOrder(orderNo : Integer)                          returns Orders;
}
