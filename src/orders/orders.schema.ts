import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Product } from "src/products/products.schema";
import { User } from "src/users/users.schema";

export type orderDocument=HydratedDocument<Order>
@Schema({timestamps:true})
export class Order {
  @Prop({
    type:mongoose.Schema.Types.ObjectId,
    ref:User.name,
  })
    user:string
   @Prop({
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Product.name
      },
      color:String,
      quantity:Number,
      price:Number
       })
    cartItems:[{
        product:string,
        color:string,
        quantity:number,
        price:number
    }];
@Prop({
    type:Number,
    default:0
})
    taxPrice:number

    @Prop({
    type:Number,
    default:0
})
    shippingPrice:number

 @Prop({
    type:Number
})
    totalOrderPrice:number;
    @Prop({
        type:String,
        enum:['card','cash'],
        default:'cash'
    })
    paymentMethodType:string
@Prop({
    type:Boolean,
    default:false
})
    isPaid:boolean;

    @Prop({
        type:Date
    })
  paidAt:Date;

@Prop({
    type:Boolean,
    default:false
})
  isDelivered:boolean

   @Prop({
        type:Date
    })
  deliveredAt:Date

@Prop({
        details:String,
        phone:String,
        city:String,
        postalCode:String
    })
shippingAddress:string
}

export const orderSchema=SchemaFactory.createForClass(Order)