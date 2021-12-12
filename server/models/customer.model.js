import mongoose, { Schema } from 'mongoose'
import crypto from 'crypto'

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
  hashed_password: {
    type: String,
    required: "Password is required"
  },
  subscriber:[
    {type:mongoose.Schema.Types.ObjectId}
  ],// seller id subscribe to customer

  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
})


CustomerSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

  CustomerSchema.path('hashed_password').validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)

CustomerSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },
  getSalt: function(){
    return this.salt
  }
}

export default mongoose.model('Customer', CustomerSchema)