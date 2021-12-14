
import Order from '../models/order.model'
import Customer from '../models/customer.model'
import Seller from '../models/seller.model'
const pipeline = []
const option = {fullDocument: "updateLookup"}

const loggedInUser = new Map()
const OrderChangeStream = Order.watch(pipeline,option)

 // OrderChangeStream.on('change',async function(change){
            //     let customerId = change.fullDocument.customerId
            //     let status = change.fullDocument.status
            //     console.log('order change',change)
            //     //query customer table to get subscriber id
            //     try {
            //         let data = await Customer.findById(customerId).select({_id:0,subscriber:1})
            //         let subscribers = data.subscriber
            //     // if order is place notify seller
            //     // if order is progress or done notify the customer
            //         if(status === 'placed'){
            //             //check if customer has a subscriber
            //             if(subscribers.length!=0){
            //                 subscribers.forEach(id=>{
            //                     console.log('subscriber id',id)
            //                 })
            //             }else{
            //                 console.log('customer has no subcriber')
            //             }
            //         }else if(status === 'progress'){
            
            //         }else{
            
            //         }
               
            //     } catch (error) {
            //         console.log(error)
            //     }
            // })

/////
// socket.emit('orderChange',["apple","banna","cherry","rocket"])
//         socket.on("token",(token)=>{
//             // parse token logic here
//             console.log(token)
//             // parse token end
            
//             //start watching change stream 
           

//         })

/////

const rootSocket = (io)=>{
    io.on('connection', function(socket) {
        console.log('socket id',socket.id);
        socket.on('userId',function(data){
            loggedInUser.set(data.userId,socket.id)
            console.log(loggedInUser)
        })
        console.log('logged in',loggedInUser)
        loggedInUser.forEach(user=>{
            console.log('useris',user)
            //socket.to(user).emit('message',user,"hello there")
        })
        console.log('message')
        
        socket.on('disconnect', (reason) => {
            console.log(reason);
        });
    });
}

export default rootSocket