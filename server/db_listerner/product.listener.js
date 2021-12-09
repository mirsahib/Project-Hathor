import Product from '../models/product.model'

Product.watch().on("change",(data)=>{
    console.log(data)
})