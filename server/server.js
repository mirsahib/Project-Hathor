import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'
import socket from 'socket.io'

// Connection URL
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
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
io.on('connection', function(socket) {
  //io.emit('Server 2 Client Message', 'Welcome!' );
  
  
  for(let i=0;i<10;i++){
      setTimeout(function(){
        socket.emit('server 2 client',i)
      },1000*i)
  }
  // socket.on('client 2 server', function(message)      {
  //   console.log(message);
  //   //io.emit('Server 2 Client Message', message.toUpperCase() ); //upcase it
  // });

  console.log('for loop done')
});
