import mongoose, { Schema } from 'mongoose'
const OrderSchema = new mongoose.Schema({
  customerId:{type:Schema.Types.ObjectId,ref:'Customer'},
  products:[],
  status:{type:String,default:'placed',enum:['placed','progress','done']},
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Order', OrderSchema)