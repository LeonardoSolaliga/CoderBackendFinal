
import mongoose from "mongoose";
const collection = "carts";
const cartSchema = new mongoose.Schema({
    products:[
        {
            _id: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "products",
            },
            quantity: {
                type: Number
            }
        },
    ],
},{
    timestamps:true
});

export const cartModel  = mongoose.model(collection,cartSchema)
