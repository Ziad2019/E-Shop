import { Module } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesController } from './sub-categories.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { SubCategory, subCategorySchema } from './sub-categories.schema';
import { Category, categorySchema } from 'src/categories/categories.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[MongooseModule.forFeature([
    {name:SubCategory.name,schema:subCategorySchema},
    {name:Category.name,schema:categorySchema},
    
  ]),UsersModule],
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService],
})
export class SubCategoriesModule {}
