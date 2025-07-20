import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApplyCoupon, UpdateCartItemsDto } from './dto/update-cart.dto';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}


// @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User

  @Post(':productId')
  @Roles('user')
  @UseGuards(AuthGuard)
  create(@Param('productId') productId, @Req() req) {

    const user_id=req.user.id
    return this.cartService.create(productId,user_id);
  }

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User
  @Get()
  @Roles('user')
  @UseGuards(AuthGuard)
  getLoggedUserCart (@Req() req) {
    const userId=req.user.id
    return this.cartService.getLoggedUserCart (userId);
  }
// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
  @Put(':cartItemId')
   @Roles('user')
  @UseGuards(AuthGuard)
  updateCartItem(@Param('cartItemId') cartItemId: string,@Req()req, @Body(new ValidationPipe({forbidNonWhitelisted:true})) updateCartItemsDto: UpdateCartItemsDto) {
    const user_id=req.user.id
    return this.cartService.updateCartItem(cartItemId,user_id ,updateCartItemsDto);
  }
// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
  @Delete(':itemId')
   @Roles('user')
  @UseGuards(AuthGuard)
  removeSpecificCartItem (@Param('itemId') itemId: string,@Req() req) {
    const userId=req.user.id
    return this.cartService.removeSpecificCartItem (itemId,userId);
  }
// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
@Patch("applyCoupon")
@UseGuards(AuthGuard)
@Roles('user')

applyCoupon(@Req()req ,@Body(new ValidationPipe({forbidNonWhitelisted:true}) )applyCoupon:ApplyCoupon ){
const userId=req.user.id
return this.cartService.applyCoupon(userId,applyCoupon)
}
}
