import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Order } from './orders.schema';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { Product } from 'src/products/products.schema';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY??"no stripe secret found");


@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel:Model<Order>,
    @InjectModel(Cart.name) private cartModel:Model<Cart>,
    @InjectModel(Product.name) private productModel:Model<Product>,
  ){}
// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User
 async crecreateCashOrderate(cartId,user_id, createOrderDto: CreateOrderDto) {
     // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart=await this.cartModel.findById(cartId);
  if(!cart){
    throw new NotFoundException("not found cart")
  }
    // 2) Get order price depend on cart price "Check if coupon apply"
    const cartPrice=cart.totalPriceAfterDiscount?cart.totalPriceAfterDiscount:cart.totalCartPrice;
    const totalOrderPrice=cartPrice+taxPrice+shippingPrice
      // 3) Create order with default paymentMethodType cash
        const order = await this.orderModel.create({
    user: user_id,
    cartItems: cart.cartItems,

    totalOrderPrice,
  });
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await this.productModel.bulkWrite(bulkOption, {});
        // 5) Clear cart depend on cartId
    await this.cartModel.findByIdAndDelete(cartId);
    return { status: 'success', data: order }

  }
}

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
async findAllOrders(){
  const order=await this.orderModel.find()
  if (!order) {
      throw new NotFoundException('order Not Found');
    }

    return {
      status: 200,
      message: 'Found a order',
      data: order,
    };
}

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager

async findSpecificOrder(user_id){
const order=await this.orderModel.findOne({user:user_id})
    if (!order) {
      throw new NotFoundException(`order Not Found of ${user_id}`);
    }

    return {
      status: 200,
      message: 'Found a order',
      data: order,
    };
}
// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
async updateOrderToPaid (id){
  const order = await this.orderModel.findById(id)
  if (!order) {
  throw new NotFoundException(`There is no such a order with this id:${id}`);
  }

  // update order to paid
  order.isPaid = true;

  // order.paidAt=Date.now()

  const updatedOrder = await order.save();
 return { status: 'success', data: updatedOrder }
}
// @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager
async updateOrderToDelivered  (id){
  const order = await this.orderModel.findById(id)
  if (!order) {
  throw new NotFoundException(`There is no such a order with this id:${id}`);
  }

  // update order to paid
  order.isDelivered = true;

//  order.deliveredAt=Date.now()

  const updatedOrder = await order.save();
 return { status: 'success', data: updatedOrder }
}
// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User

// ***********************
async checkoutSession(cartId: string, req) {
 
  const taxPrice = 0;
  const shippingPrice = 0;

  
  const cart = await this.cartModel.findById(cartId);
  if (!cart) throw new NotFoundException(`There is no such cart with id ${cartId}`);

  
  const cartPrice = cart.totalPriceAfterDiscount ?? cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',

    line_items: [
      {
        price_data: {
          currency: 'egp',                        
          unit_amount: Math.round(totalOrderPrice * 100), 
          product_data: {
            name: 'Order Payment',
            description: `Cart #${cartId}`,
            // images: ['https://yourdomain.com/logo.png'] 
          }
        },
        quantity: 1
      }
    ],

    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url:  `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: cartId
    // metadata: { ...req.body.shippingAddress }  
  });

 
  return { status: 'success', session };
}
// **********************
// const createCardOrder = async (session) => {
//   const cartId = session.client_reference_id;
//   const shippingAddress = session.metadata;
//   const oderPrice = session.amount_total / 100;

//   const cart = await Cart.findById(cartId);
//   const user = await User.findOne({ email: session.customer_email });

//   // 3) Create order with default paymentMethodType card
//   const order = await Order.create({
//     user: user._id,
//     cartItems: cart.cartItems,
//     shippingAddress,
//     totalOrderPrice: oderPrice,
//     isPaid: true,
//     paidAt: Date.now(),
//     paymentMethodType: 'card',
//   });

//   // 4) After creating order, decrement product quantity, increment product sold
//   if (order) {
//     const bulkOption = cart.cartItems.map((item) => ({
//       updateOne: {
//         filter: { _id: item.product },
//         update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
//       },
//     }));
//     await Product.bulkWrite(bulkOption, {});

//     // 5) Clear cart depend on cartId
//     await Cart.findByIdAndDelete(cartId);
//   }
// }


}
