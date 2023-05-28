import mongoose from "mongoose";
//import ContainerMongo from "./Mongodb.js"
import mongoosePagination from "mongoose-paginate-v2"

const productsSchema = new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    category:String,
    stock:{type:Number,required:true},
    code:{
        type:String,
        unique:true,
        required:true
    },
    image:String
},{
    timestamps:true
});
productsSchema.plugin(mongoosePagination);

export const productsModel  = mongoose.model('products',productsSchema)