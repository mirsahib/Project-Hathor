import express from 'express'
import customerCtrl from '../controllers/customer.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/customer')
  .get(customerCtrl.list)
  .post(customerCtrl.create)

router.route('/api/customer/order')
  .post(customerCtrl.createOrder)

router.route('/api/customer/:customerId')
  .get(authCtrl.requireSignin, customerCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, customerCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, customerCtrl.remove)

router.param('customerId', customerCtrl.customerByID)

export default router