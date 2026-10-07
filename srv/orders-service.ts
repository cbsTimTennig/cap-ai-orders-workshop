import cds from '@sap/cds'
import registerOrderActions from './order-operations'

export default class OrdersService extends cds.ApplicationService {
  init() {
    registerOrderActions(this)
    return super.init()
  }
}