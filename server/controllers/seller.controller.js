import Seller from '../models/seller.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {
  const seller = new Seller(req.body)
  try {
    await seller.save()
    return res.status(200).json({
      message: "Seller created successfully!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load seller and append to req.
 */
const sellerByID = async (req, res, next, id) => {
  try {
    let seller = await Seller.findById(id)
    if (!seller)
      return res.status('400').json({
        error: "seller not found"
      })
    req.profile = seller
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve seller"
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
    let sellers = await Seller.find()
    res.json(sellers)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  try {
    let seller = req.profile
    seller = extend(seller, req.body)
    seller.updated = Date.now()
    await seller.save()
    seller.hashed_password = undefined
    seller.salt = undefined
    res.json(seller)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let seller = req.profile
    let deletedSeller = await seller.remove()
    deletedSeller.hashed_password = undefined
    deletedSeller.salt = undefined
    res.json(deletedSeller)
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
  sellerByID,
  read,
  list,
  remove,
  update,
  subscribe
}