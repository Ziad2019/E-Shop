import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Query, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //  @docs   Admin Can Create a Product
  //  @Route  POST /api/v1/product
  //  @access Private [Admin]
  @Post()
  @Roles('admin')
  @UseGuards(AuthGuard)
  // @UseInterceptors(FileInterceptor('imageCover'))
  // // @UseInterceptors(FileInterceptor('images'))
  // @UseInterceptors(FilesInterceptor('images', 10))
  @UseInterceptors(
  FileFieldsInterceptor([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ])
)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    createProductDto: CreateProductDto,
     @UploadedFiles()
  files: {
    imageCover?:any;
    images?: any;
  }

  ) {
     const imageCover = files?.imageCover?.[0];
  const images = files?.images;
    return this.productsService.create(createProductDto,imageCover,images);
  }

  //  @docs   Any User Can Get Products
  //  @Route  GET /api/v1/product
  //  @access Public
  @Get()
  findAll(@Query() query) {
    return this.productsService.findAll(query);
  }
  //  @docs   Any User Can Get Product
  //  @Route  GET /api/v1/product
  //  @access Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  //  @docs   Admin Can Update a Product
  //  @Route  PATCH /api/v1/product
  //  @access Private [Admin]
  @Patch(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  //  @docs   Admin Can Delete a Product
  //  @Route  DELETE /api/v1/product
  //  @access Private [Admin]
  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
