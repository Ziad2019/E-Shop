import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from './orders.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { Product, productSchema } from 'src/products/products.schema';
import { Cart, cartSchema } from 'src/cart/cart.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {name:Order.name,schema:orderSchema},
    {name:User.name,schema:UserSchema},
    {name:Product.name,schema:productSchema},
    {name:Cart.name,schema:cartSchema},
  ])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
