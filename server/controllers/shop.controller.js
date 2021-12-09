import Shop from '../models/shop.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {
  const shop = new Shop(req.body)
  try {
    await shop.save()
    return res.status(200).json({
      message: "Shop created successfully!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load shop and append to req.
 */
const shopByID = async (req, res, next, id) => {
  try {
    let shop = await Shop.findById(id)
    if (!shop)
      return res.status('400').json({
        error: "shop not found"
      })
    req.profile = shop
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve shop"
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
    let shops = await Shop.find()
    res.json(shops)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  try {
    let shop = req.profile
    shop = extend(shop, req.body)
    shop.updated = Date.now()
    await shop.save()
    shop.hashed_password = undefined
    shop.salt = undefined
    res.json(shop)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let shop = req.profile
    let deletedShop = await shop.remove()
    deletedShop.hashed_password = undefined
    deletedShop.salt = undefined
    res.json(deletedShop)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  shopByID,
  read,
  list,
  remove,
  update
}