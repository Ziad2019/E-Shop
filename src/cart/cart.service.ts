import { HttpException, Injectable } from '@nestjs/common';
import { ApplyCoupon, UpdateCartItemsDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model } from 'mongoose';
import { Product } from 'src/products/products.schema';
import { Coupon } from 'src/coupons/coupons.schema';




@Injectable()

export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel:Model<Cart>,
    @InjectModel(Product.name) private productModel:Model<Product>,
    @InjectModel(Coupon.name) private couponModel:Model<Coupon>
  ){}
// @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User
 async create(productId,user_id) {
    const product=await this.productModel.findById(productId)
   // 1) Get Cart for logged user
   let cart=await this.cartModel.findOne({user:user_id})
   if(!cart){
    // create cart for logged user with product
     cart=await this.cartModel.create({
      user:user_id,
      cartItems:[{product:productId,price:product?.price,color:product?.color}]
     })
   }
   else{
    const productIndex=cart.cartItems.findIndex(
      item=>item.product.toString()=== productId.toString() && item.price===product?.price
    )
    if(productIndex>-1){
      const cartItem=cart.cartItems[productIndex]
      cartItem.quantity+=1
    }
    else{
      // eslint-disable-next-line
        // @ts-ignore
      cart.cartItems.push({ product:productId,price:product?.price,color:product?.color});
    }
   }
    // Calculate total cart price
    let totalCartPrice=0
  cart.cartItems.map(item=>{
   totalCartPrice+=item.price*item.quantity
  })
  cart.totalCartPrice=totalCartPrice
  await cart.save()

    return  {
    status: 'success',
    message: 'Product added to cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart}
  }

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User
 async getLoggedUserCart (userId) {
    const cart=await this.cartModel.findOne({user:userId})
    .populate('cartItems.product', 'price title ')
    if(!cart){
      throw new HttpException('There is no cart for this user id : ${userId}',404)
    }
    return {
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  };
  }
// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
async  updateCartItem (cartItemId,user_id , updateCartItemsDto: UpdateCartItemsDto) {

 let cart=await this.cartModel.findOne({user:user_id})
if(!cart){
  throw new HttpException(`there is no cart for user ${user_id}`,404)
}
// console.log(cart.cartItems)
const itemIndex=cart.cartItems.findIndex(
  // eslint-disable-next-line
        // @ts-ignore
  item=>item._id.toString()===cartItemId
)

if(itemIndex>-1){
  const cartItem=cart.cartItems[itemIndex]
  cartItem.quantity=updateCartItemsDto.quantity
  cartItem.color=updateCartItemsDto.color
  cart.cartItems[itemIndex]=cartItem
  
}
 // Calculate total cart price
    let totalCartPrice=0
  cart.cartItems.map(item=>{
   totalCartPrice+=item.price*item.quantity
  })
  cart.totalCartPrice=totalCartPrice
 await cart.save()

    return {
    status: 'success',
  
    numOfCartItems: cart.cartItems.length,
    data: cart,
  };
  }
// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
 async removeSpecificCartItem (itemId,user_id) {
      const cart = await this.cartModel.findOneAndUpdate(
    { user: user_id },
    {
      $pull: { cartItemsproduct: { _id: itemId } },
    },
    { new: true }
  );
     // Calculate total cart price
    let totalCartPrice=0
        // eslint-disable-next-line
        // @ts-ignore
  cart.cartItems.map(item=>{
   totalCartPrice+=item.price*item.quantity
  })
  // eslint-disable-next-line
        // @ts-ignore
  cart.totalCartPrice=totalCartPrice
  // eslint-disable-next-line
        // @ts-ignore
  await cart.save()

    return {
    status: 'success',
    // eslint-disable-next-line
        // @ts-ignore
    numOfCartItems: cart.cartItems.length,
    data: cart,
  };
  }
// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
async applyCoupon(user_id,applyCoupon:ApplyCoupon){
    // 1) Get coupon based on coupon name
  const coupon = await this.couponModel.findOne({
    name: applyCoupon.name,
  });
   // eslint-disable-next-line
        // @ts-ignore
   const isExpired = new Date(coupon?.expireDate) > new Date();
    if (!isExpired) {
      throw new HttpException('Invalid expired', 400);
    }

  if (!coupon) {
    throw new HttpException('Coupon is invalid ',404)
  }

  // 2) Get logged user cart to get total cart price
  const cart = await this.cartModel.findOne({ user: user_id });
  // eslint-disable-next-line
        // @ts-ignore
  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  // eslint-disable-next-line
        // @ts-ignore
  cart.totalPriceAfterDiscount =totalPriceAfterDiscount ;
    // eslint-disable-next-line
        // @ts-ignore
  await cart.save();

 return{
    status: 'success',
      // eslint-disable-next-line
        // @ts-ignore
    numOfCartItems: cart.cartItems.length,
    data: cart,
  };
}
}
