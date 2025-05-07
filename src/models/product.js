import mongoose from 'mongoose';



const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    stock:{type:Number,required:true},
    category:{
        type:String,
        enum:['vino','cerveza','whisky','vodka',],
        default:'otros',
    },
    description:{type:String},
    image:{type:String},
    isAvailable:{type: Boolean,default:true}
},{timestamps:true});

const Product = mongoose.model('Product', productSchema);

// ✅ Exportación correcta para ES Modules
export default Product;