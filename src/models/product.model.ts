import mongoose from "mongoose";



const schema = new mongoose.Schema({


name:{
    type:String,
required:[true,"please enter name"]
},


photo : {
    type:String,
    required:[true,"please enter Photo"]
},
price : {
    type:Number,
    required:[true,"please enter Price"]
},
stock : {
    type:Number,
    required:[true,"please enter stock"]
},
category : {
    type:String,
    required:[true,"please enter product category"],
    trim : true,
},

},
{timestamps:true,})




export const Product = mongoose.model('Product',schema)

