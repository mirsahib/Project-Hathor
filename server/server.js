import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'
import socket from 'socket.io'
import rootSocket from './middleware/socket.middleware'
//import Product from './models/product.model'

// Connection URL
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,useFindAndModify: false })
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

const server =  app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})

const io = socket(server)
rootSocket(io)

// io.on('connection', function(socket) {
//   console.log(socket.id);

//     socket.on('disconnect', (reason) => {
//         console.log(reason);
//     });
// });

// Product.watch().on("change",(data)=>{
//   io.emit('server 2 client',data)
// })