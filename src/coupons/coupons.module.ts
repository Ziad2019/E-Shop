import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, couponSchema } from './coupons.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Coupon.name,schema:couponSchema}]),UsersModule],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
