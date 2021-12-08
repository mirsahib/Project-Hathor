import Product from '../models/product.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {
  const product = new Product(req.body)
  try {
    await product.save()
    return res.status(200).json({
      message: "Product created successfully!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load product and append to req.
 */
const productByID = async (req, res, next, id) => {
  try {
    let product = await Product.findById(id)
    if (!product)
      return res.status('400').json({
        error: "product not found"
      })
    req.profile = product
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve product"
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
    let products = await Product.find()
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  try {
    let product = req.profile
    product = extend(product, req.body)
    product.updated = Date.now()
    await product.save()
    product.hashed_password = undefined
    product.salt = undefined
    res.json(product)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let product = req.profile
    let deletedProduct = await product.remove()
    deletedProduct.hashed_password = undefined
    deletedProduct.salt = undefined
    res.json(deletedProduct)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

Product.watch().on("change",(data)=>{
  console.log(data)
})

export default {
  create,
  productByID,
  read,
  list,
  remove,
  update,
}