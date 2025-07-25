import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './sub-categories.schema';
import { Model } from 'mongoose';
import { Category } from 'src/categories/categories.schema';

@Injectable()
export class SubCategoriesService {
  constructor(@InjectModel(SubCategory.name) private subCategoryModel:Model<SubCategory>,
              @InjectModel(Category.name) private categoryModel:Model<Category>){}

// create subCategory
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findOne({
      name: CreateSubCategoryDto.name,
    });

    if (subCategory) {
      throw new HttpException('Sub Category already exist', 400);
    }

    const category = await this.categoryModel.findById(
      createSubCategoryDto.category,
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const newSubCategory = await (
      await this.subCategoryModel.create(createSubCategoryDto)
    ).populate('category', '-_id -__v');
    return {
      status: 200,
      message: 'Sub Category created successfully',
      data: newSubCategory,
    };
  }
// find all subCategory
  async findAll() {
    const subcategory = await this.subCategoryModel
      .find()
      .populate('category', '-_id -__v');
    return {
      status: 200,
      message: 'Sub Categorys found',
      length: subcategory.length,
      isEmpty: subcategory.length > 0 ? 'false' : 'true',
      data: subcategory,
    };
  }
// find one subCategory by id
  async findOne(_id: string) {
    const subCategory = await this.subCategoryModel
      .findOne({ _id })
      .select('-__v')
      .populate('category', '-_id -__v');
    if (!subCategory) {
      throw new NotFoundException('Sub Category not found');
    }

    return {
      status: 200,
      message: 'Sub Category found',
      data: subCategory,
    };
  }
// update one subCategory by id
  async update(_id: string, UpdateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findOne({ _id });
    if (!subCategory) {
      throw new NotFoundException('Sub Category not found');
    }

    const updatedSubCategory = await this.subCategoryModel
      .findByIdAndUpdate({ _id }, UpdateSubCategoryDto, { new: true })
      .select('-__v')
      .populate('category', '-_id -__v');

    return {
      status: 200,
      message: 'Sub Category updated successfully',
      data: updatedSubCategory,
    };
  }
// delete one subCategory by id
  async remove(_id: string) {
    const subCategory = await this.subCategoryModel.findOne({ _id });
    if (!subCategory) {
      throw new NotFoundException('Sub Category not found');
    }
    await this.subCategoryModel.deleteOne({ _id });
    return {
      status: 200,
      message: 'Sub Category deleted successfully',
    };
  }
}
