
import Order from '../models/order.model'
import Customer from '../models/customer.model'
import Seller from '../models/seller.model'
const pipeline = []
const option = {fullDocument: "updateLookup"}


const OrderChangeStream = Order.watch(pipeline,option)

const rootSocket = (io)=>{
    io.on('connection', function(socket) {
        console.log('socket id',socket.id);
        // productChangeStream.on('change',function(change){
        //     socket.emit('server 2 client',change)
        // })
        socket.emit('orderChange',["apple","banna","cherry","rocket"])
        socket.on("token",(token)=>{
            // parse token logic here

            // parse token end
            
            //start watching change stream 
            OrderChangeStream.on('change',async function(change){
                let customerId = change.fullDocument.customerId
                let status = change.fullDocument.status
                console.log('order change',change)
                //query customer table to get subscriber id
                try {
                    let data = await Customer.findById(customerId).select({_id:0,subscriber:1})
                    let subscribers = data.subscriber
                // if order is place notify seller
                // if order is progress or done notify the customer
                    if(status === 'placed'){
                        //check if customer has a subscriber
                        if(subscribers.length!=0){
                            subscribers.forEach(id=>{
                                console.log('subscriber id',id)
                            })
                        }else{
                            console.log('customer has no subcriber')
                        }
                    }else if(status === 'progress'){
            
                    }else{
            
                    }
               
                } catch (error) {
                    console.log(error)
                }
            })

        })
        socket.on('disconnect', (reason) => {
            console.log(reason);
        });
    });
}

export default rootSocket