
import Product from '../models/product.model'
let productChangeStream = Product.watch()


const rootSocket = (io)=>{
    io.on('connection', function(socket) {
        console.log('socket id',socket.id);
        productChangeStream.on('change',function(change){
            socket.emit('server 2 client',change)
        })
        socket.on('disconnect', (reason) => {
            console.log(reason);
        });
        
    });
}

export default rootSocket