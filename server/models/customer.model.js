import mongoose, { Schema } from 'mongoose'
const CustomerSchema = new mongoose.Schema({

  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+@.+..+/, 'Please fill a valid email address'],
    required: 'Email is required'
  },
  orders:[
    {type:Schema.Types.ObjectId,ref:'Order'}
  ],
  password: {
    type: String,
    required: "Password is required"
  },
  subscriber:[
    {type:mongoose.Schema.Types.ObjectId}
  ],

  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Customer', CustomerSchema)