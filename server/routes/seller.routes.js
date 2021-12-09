import express from 'express'
import sellerCtrl from '../controllers/seller.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/seller')
  .get(sellerCtrl.list)
  .post(sellerCtrl.create)

router.route('/api/seller/:sellerId')
  .get(authCtrl.requireSignin, sellerCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, sellerCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, sellerCtrl.remove)

router.param('sellerId', sellerCtrl.sellerByID)

export default router