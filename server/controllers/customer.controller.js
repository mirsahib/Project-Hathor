import Customer from '../models/customer.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {
  const customer = new Customer(req.body)
  try {
    await customer.save()
    return res.status(200).json({
      message: "Customer created successfully!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load customer and append to req.
 */
const customerByID = async (req, res, next, id) => {
  try {
    let customer = await Customer.findById(id)
    if (!customer)
      return res.status('400').json({
        error: "customer not found"
      })
    req.profile = customer
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve customer"
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
    let customers = await Customer.find()
    res.json(customers)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  try {
    let customer = req.profile
    customer = extend(customer, req.body)
    customer.updated = Date.now()
    await customer.save()
    customer.hashed_password = undefined
    customer.salt = undefined
    res.json(customer)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let customer = req.profile
    let deletedCustomer = await customer.remove()
    deletedCustomer.hashed_password = undefined
    deletedCustomer.salt = undefined
    res.json(deletedCustomer)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const subscribe = async(req,res) =>{
  res.send('hello')
}

export default {
  create,
  customerByID,
  read,
  list,
  remove,
  update,
  subscribe
}