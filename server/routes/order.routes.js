import express from 'express'
import orderCtrl from '../controllers/order.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/order')
  .get(orderCtrl.list)
  .post(orderCtrl.create)

router.route('/api/order/:orderId')
  .get(authCtrl.requireSignin, orderCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, orderCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, orderCtrl.remove)

router.param('orderId', orderCtrl.orderByID)

export default router