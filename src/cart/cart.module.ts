import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, cartSchema } from './cart.schema';
import { Product, productSchema } from 'src/products/products.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { UsersModule } from 'src/users/users.module';
import { Coupon, couponSchema } from 'src/coupons/coupons.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {name:Cart.name,schema:cartSchema},
    {name:Product.name,schema:productSchema},
    {name:Coupon.name,schema:couponSchema},
    {name:User.name,schema:UserSchema},
  ]),UsersModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
