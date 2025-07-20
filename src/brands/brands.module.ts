import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, brandSchema } from './brands.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Brand.name,schema:brandSchema}]),UsersModule],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
