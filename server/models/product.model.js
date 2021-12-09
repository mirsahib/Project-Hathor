import mongoose from 'mongoose'
const ProductSchema = new mongoose.Schema({

  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Product', ProductSchema)