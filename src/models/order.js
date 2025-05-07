import mongoose from 'mongoose';



const ordersSchema = new mongoose.Schema({
    fecha:{type:Date,default:Date.now},
    estado:{
       type:String,
       enum:['pendiente','procesado','enviado','entregado','cancelado'],
       required:true
    },
    clienteId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    products:[
        {
            productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
            quantity:{type:Number,required:true}
        }
    ]
    
},{timestamps:true});

// ✅ Declarar el modelo antes de exportarlo
const Order = mongoose.model('Order', ordersSchema);
export default Order;