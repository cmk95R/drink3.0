import mongoose from 'mongoose';



const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    
    stock:{type:Number,required:true},
    category:{
        type:String,
        enum: [
        'vino', 
        'cerveza', 
        'whisky', 
        'vodka', 
        'ron', 
        'tequila', 
        'ginebra', 
        'champagne', 
        'cognac', 
        'licor', 
        'sidra', 
        'vermut',
        'mezcal', 
        'brandy',
        'otros'
    ],
        default:'otros',
    },
    description:{type:String},
    image:{type:String},
    isAvailable:{type: Boolean,default:true}
},{timestamps:true});

const Product = mongoose.model('Product', productSchema);

// ✅ Exportación correcta para ES Modules
export default Product;