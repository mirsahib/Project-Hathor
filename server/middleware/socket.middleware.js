
import Order from '../models/order.model'
import Customer from '../models/customer.model'
import Seller from '../models/seller.model'
import jwt from 'jsonwebtoken'
import config from '../../config/config'


const pipeline = []
const option = {fullDocument: "updateLookup"}
let OrderChange = Order.watch()
const loggedInUser = {}

const rootSocket = (io)=>{
    io.use(function(socket,next){
        let token = socket.handshake.auth.token || null
        if(token){
            jwt.verify(token,config.jwtSecret,function(err,decoded){
                if(decoded){
                    next()
                }else{
                    next(new Error(err.message));
                }
            })
        }else{
            next(new Error("token missing"));
        }
    })
    io.on('connection', function(socket) {
        console.log('socket id',socket.id);
        
        socket.on('userId',function(data){
            loggedInUser[data.userId] = socket.id
            console.log('logged in user',loggedInUser)
        })
        //order stream change
        OrderChange.on('change',async function(change){
            let customerId = change.fullDocument.customerId
            let status = change.fullDocument.status
            let product = change.fullDocument.products
            console.log('order change',change)

            try {
                let customerData = await Customer.findById(customerId).select({_id:0,subscriber:1})
                console.log('customer data',customerData)
                let subscribers = customerData.subscriber
                console.log('subscribers',subscribers)
            // if order is place notify seller
            // if order is progress or done notify the customer
                if(status === 'placed'){
                    //check if customer has a subscriber

                    if(subscribers.length!=0){
                        console.log(subscribers.length)
                        subscribers.forEach(id=>{
                            io.to(loggedInUser[id]).emit('product',product)
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
        //end order stream change
        socket.on('disconnect', (reason) => {
            //cleanup
            Object.keys(loggedInUser).forEach(id=>{
                if(loggedInUser[id]===socket.id){
                    delete loggedInUser[id]
                }
            })
            console.log('logged in user',loggedInUser)
            console.log('logged out user',socket.id,'reason',reason)
            //delete loggedInUser[]
        });
    });
}

export default rootSocket