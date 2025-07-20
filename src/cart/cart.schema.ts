import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Mongoose } from "mongoose";
import { ref } from "process";
import { Product } from "src/products/products.schema";
import { User } from "src/users/users.schema";

export type cartDcoument=HydratedDocument<Cart>

@Schema({timestamps:true})
export class Cart {
  @Prop({
   type:[
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:Product.name,
            
        },
        color:{
            type:String
        },
        quantity:{
            type:Number,
            default:1,
            
        },
          price:{
            type:Number,
            
        },
    }
   ]
  })
    cartItems:[{
        product:string,
        color:string,
        quantity:number,
        price:number
    }]
    @Prop({
        type:Number,
    })
    totalCartPrice:number
     @Prop({
        type:Number,
    })
    totalPriceAfterDiscount:number
     @Prop({
        type:mongoose.Schema.Types.ObjectId,
        ref:User.name
    })
    user:string
}

export const cartSchema=SchemaFactory.createForClass(Cart)