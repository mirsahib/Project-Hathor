import Order from '../models/order.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {
  const order = new Order(req.body)
  try {
    await order.save()
    return res.status(200).json({
      message: "Order created successfully!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load order and append to req.
 */
const orderByID = async (req, res, next, id) => {
  try {
    let order = await Order.findById(id)
    if (!order)
      return res.status('400').json({
        error: "order not found"
      })
    req.profile = order
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve order"
    })
  }
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const list = async (req, res) => {
  try {
    let orders = await Order.find()
    res.json(orders)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  try {
    let order = req.profile
    order = extend(order, req.body)
    order.updated = Date.now()
    await order.save()
    order.hashed_password = undefined
    order.salt = undefined
    res.json(order)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let order = req.profile
    let deletedOrder = await order.remove()
    deletedOrder.hashed_password = undefined
    deletedOrder.salt = undefined
    res.json(deletedOrder)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  orderByID,
  read,
  list,
  remove,
  update
}