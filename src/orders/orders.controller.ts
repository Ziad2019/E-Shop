import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User

  @Post(':cartId')
  @Roles('user')
  @UseGuards(AuthGuard)
  createCashOrder(@Param('cartId')cartId:string ,@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const user_id=req.user.id
    return this.ordersService.crecreateCashOrderate(cartId,user_id,createOrderDto);
  }
// @desc    Get all orders
// @route   Get /api/v1/orders
// @access  Protected/Admin-Manager
 @Get()
  @Roles('admin','manager')
  @UseGuards(AuthGuard)
findAllOrders (){
  return this.ordersService.findAllOrders();
}

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
 @Get(":id")
  @Roles('admin','manager','user')
  @UseGuards(AuthGuard)
findSpecificOrder (@Req() req){
const user_id=req.user.id;
return this.ordersService.findSpecificOrder(user_id);
}

// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
 @Patch(":id/pay")
  @Roles('admin','manager')
  @UseGuards(AuthGuard)
  updateOrderToPaid (@Param('id')id){
return this.ordersService.updateOrderToPaid(id)
  }
  // @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager
 @Patch(":id/deliver")
  @Roles('admin','manager')
  @UseGuards(AuthGuard)
  updateOrderToDelivered (@Param('id')id){
return this.ordersService.updateOrderToDelivered(id)
  }
  // @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User
 @Post("checkout-session/:cartId")
  @Roles('user')
  @UseGuards(AuthGuard)
checkoutSession(@Param('cartId')cartId,@Req()req){
  return this.ordersService.checkoutSession(cartId,req)
}
}
