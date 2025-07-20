import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { BrandsModule } from './brands/brands.module';
import { CouponsModule } from './coupons/coupons.module';
import { ProductsModule } from './products/products.module';
import { TaxModule } from './tax/tax.module';
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './send-email/send-email.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
     ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRoot(process.env.DB_URI??"not found url to connection database"),
    JwtModule.register({ 
      global:true,
      secret:process.env.JWT_SECRET_KEY,
      signOptions:{expiresIn: process.env.JWT_EXPIRE_TIME}
    }),
     ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    SubCategoriesModule,
    BrandsModule,
    CouponsModule,
    ProductsModule,
    TaxModule,
    ReviewModule,
    CartModule,
    OrdersModule,
    UploadsModule,
    MailModule
  ],
  controllers: [],
  providers: [
      {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}