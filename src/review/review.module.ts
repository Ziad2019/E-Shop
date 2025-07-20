import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, reviewSchema } from './review.schema';
import { UsersModule } from 'src/users/users.module';
import { Product, productSchema } from 'src/products/products.schema';
import { User, UserSchema } from 'src/users/users.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {name:Review.name,schema:reviewSchema},
    {name:Product.name,schema:productSchema},
    {name:User.name,schema:UserSchema}
  ]),UsersModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
