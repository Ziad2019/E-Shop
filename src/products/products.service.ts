import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './products.schema';
import { Category } from 'src/categories/categories.schema';
import { SubCategory } from 'src/sub-categories/sub-categories.schema';
import { Model } from 'mongoose';
import { UploadService } from 'src/uploads/uploads.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Category.name)
    private readonly categoryModule: Model<Category>,
    @InjectModel(SubCategory.name)
    private readonly subCategoryModule: Model<SubCategory>,
    private readonly uploadService: UploadService
  ) {}

  async create(createProductDto: CreateProductDto,imageCover:any,images:any) {
    
    const product = await this.productModel.findOne({
      title: createProductDto.title,
    });
     if (product) {
      throw new HttpException('This Product already Exist', 400);
    }
    const category = await this.categoryModule.findById(
      createProductDto.category,
    );
    if (!category) {
      throw new HttpException('This Category not Exist', 400);
    }

    if (createProductDto.subCategory) {
      const subCategory = await this.subCategoryModule.findById(
        createProductDto.subCategory,
      );
      if (!subCategory) {
        throw new HttpException('This Sub Category not Exist', 400);
      }
    }
    
    const priceAfterDiscount = createProductDto?.priceAfterDiscount || 0;
    if (createProductDto.price < priceAfterDiscount) {
      throw new HttpException(
        'old price must be greter than price after discount ',
        400,
      );
    }
    
    let imageId=null;
    if(imageCover){
     const createImage= await this.uploadService.uploadImage(imageCover,
      {
        folder: 'products/imageCover',
        maxWidth: 800,
        maxHeight: 800,
        quality: 85,
      }
     )
     
      // eslint-disable-next-line
        // @ts-ignore
     imageId=createImage._id
   
    }

    let imagesId=null
    if(images){
      const uploadImages=await this.uploadService.uploadImages(images,{
        folder: 'products/images',
        maxWidth: 800,
        maxHeight: 800,
        quality: 85,
      })
      // eslint-disable-next-line
        // @ts-ignore
      imagesId=uploadImages
    }
    const newProduct = await (
      await this.productModel.create({createProductDto,imageCover:imageId,images:imagesId})
    ).populate('category subCategory brand imageCover', '-__v');
    return {
      status: 200,
      message: 'Product created successfully',
      data: newProduct,
    };
  }

  async findAll(query: any) {
    // 1) filter
    // eslint-disable-next-line prefer-const
    let requestQuery = { ...query };
    
    const removeQuery = [
      'page',
      'limit',
      'sort',
      'keyword',
      'category',
      'fields',
    ];
    removeQuery.forEach((singelQuery) => {
      delete requestQuery[singelQuery];
    });

 
    const stringQuery= JSON.stringify(requestQuery).replace(
        /\b(gte|lte|lt|gt)\b/g,
        (match) => `$${match}`,
      )
      
    requestQuery = JSON.parse(stringQuery);
    

    // 2) pagenation
    const page = query?.page || 1;
    const limit = query?.limit || 5;
    const skip = (page - 1) * limit;

    // 3) sorting
    // eslint-disable-next-line prefer-const
    let sort = query?.sort || 'asc';
    if (!['asc', 'desc'].includes(sort)) {
      throw new HttpException('Invalid sort', 400);
    }

    // // 4) fields
    // eslint-disable-next-line prefer-const
    let fields = query?.fields || ''; // description,title
    fields = fields.split(',').join(' ');

    // // 5) search
    // // eslint-disable-next-line prefer-const
    let findData = { ...requestQuery };

    if (query.keyword) {
      findData.$or = [
        { title: { $regex: query.keyword } },
        { description: { $regex: query.keyword } },
      ];
    }
    if (query.category) {
      findData.category = query.category.toString();
    }

    const products = await this.productModel
      .find(requestQuery)
      .limit(limit)
      .skip(skip)
      .sort({ title: sort })
      .select(fields);
    return {
      status: 200,
      message:  products.length > 0 ? 'Found Product' : 'not Found Product' ,
      isEmpty: products.length > 0 ? 'false' : 'true',
      length: products.length,
      data: products,
    };
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .select('-__v')
      .populate('category subCategory brand', '-__v');
    if (!product) {
      throw new NotFoundException('Procut Not Found');
    }

    return {
      status: 200,
      message: 'Found a Product',
      data: product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    if (updateProductDto.category) {
      const category = await this.categoryModule.findById(
        updateProductDto.category,
      );
      if (!category) {
        throw new HttpException('This Category not Exist', 400);
      }
    }
    if (updateProductDto.subCategory) {
      const subCategory = await this.subCategoryModule.findById(
        updateProductDto.subCategory,
      );
      if (!subCategory) {
        throw new HttpException('This Sub Category not Exist', 400);
      }
    }

    if (product.quantity < updateProductDto.sold) {
      throw new HttpException('Thie Quantity is < sold', 400);
    }

    const price = updateProductDto?.price || product.price;
    const priceAfterDiscount =
      updateProductDto?.priceAfterDiscount || product.priceAfterDiscount;
    if (price < priceAfterDiscount) {
      throw new HttpException(
        'Must be price After discount greater than price',
        400,
      );
    }

    return {
      status: 200,
      message: 'Product Updated successfully',
      data: await this.productModel
        .findByIdAndUpdate(id, updateProductDto, {
          new: true,
        })
        .select('-__v')
        .populate('category subCategory brand', '-__v'),
    };
  }

  async remove(id: string): Promise<void> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Procut Not Found');
    }

    await this.productModel.findByIdAndDelete(id);
  }
}
