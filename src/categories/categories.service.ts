import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './categories.schema';
import { Model } from 'mongoose';
import { UploadService } from 'src/uploads/uploads.service';

@Injectable()
export class CategoriesService {
 constructor(@InjectModel(Category.name) private categoryModel:Model<Category>,
private readonly uploadService: UploadService){}

// create categories
  async create(createCategoryDto: CreateCategoryDto,image) {
    const category = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (category) {
      throw new HttpException('Category already exist', 400);
    }

       let imageId = null;
    if (image) {
      const uploadedImage = await this.uploadService.uploadImage(image, {
        folder: 'categories',
        maxWidth: 800,
        maxHeight: 800,
        quality: 85,
      });
        // eslint-disable-next-line
        // @ts-ignore
      imageId = uploadedImage._id;
    }

    const newCategory = (await this.categoryModel.create({createCategoryDto,image:imageId})).populate('image');
    return {
      status: 200,
      message: 'Category created successfully',
      data: newCategory,
    };
  }
// find all categories
  async findAll() {
    const category = await this.categoryModel.find().select('-__v').populate('image');
    return {
      status: 200,
      message: 'Categorys found',
      length: category.length,
      isEmpty: category.length > 0 ? 'false' : 'true',
      data: category,
    };
  }
// find one category by id
  async findOne(_id: string) {
    const category = await this.categoryModel.findOne({ _id }).select('-__v');
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      status: 200,
      message: 'Category found',
      data: category,
    };
  }
// update one category by id
  async update(_id: string, updateCategoryDto: UpdateCategoryDto,image) {
    const category = await this.categoryModel.findOne({ _id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
 const uploadedImage = await this.uploadService.uploadImage(image, {
      folder: 'categories',
      maxWidth: 800,
      maxHeight: 800,
      quality: 85,
    });
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate({ _id }, {updateCategoryDto,image:uploadedImage}, { new: true })
      .select('-__v').populate("image")

    return {
      status: 200,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

//  one category by id
  async remove(_id: string) {
    const category = await this.categoryModel.findOne({ _id }).select('-__v');
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryModel.deleteOne({ _id });
    return {
      status: 200,
      message: 'Category deleted successfully',
    };
  }
}
