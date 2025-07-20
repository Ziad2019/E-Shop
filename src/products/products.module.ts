import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from './products.schema';
import { Category, categorySchema } from 'src/categories/categories.schema';
import { SubCategory, subCategorySchema } from 'src/sub-categories/sub-categories.schema';
import { UsersModule } from 'src/users/users.module';
import { ImageSchema } from 'src/uploads/image.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {name:Product.name,schema:productSchema},
    {name:Category.name,schema:categorySchema},
    {name:SubCategory.name,schema:subCategorySchema},
      // { name: Image.name, schema: ImageSchema }
  ]),UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
