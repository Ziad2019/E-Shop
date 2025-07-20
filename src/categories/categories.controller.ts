import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('categories')
export class  CategoriesController
 {
  constructor(private readonly categoriesService: CategoriesService) {}

  //  @docs   Admin Can create a new category
  //  @Route  POST /api/v1/category
  //  @access Private [Amdin]
  @Post()
  @UseGuards(AuthGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCategoryDto: CreateCategoryDto,
     @UploadedFile() image?:any,
  ) {
    return this.categoriesService.create(createCategoryDto,image);
  }

  //  @docs   Any User Can get categorys
  //  @Route  GET /api/v1/category
  //  @access Public
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  //  @docs   Any User Can get any category
  //  @Route  GET /api/v1/category/:id
  //  @access Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  //  @docs   Admin Can update any category
  //  @Route  UPDATE /api/v1/category/:id
  //  @access Private [Amdin]
  @Patch(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCategoryDto: UpdateCategoryDto,
     @UploadedFile() image?:any,

  ) {
    return this.categoriesService.update(id, updateCategoryDto,image);
  }

  //  @docs   Admin Can delete any category
  //  @Route  DELETE /api/v1/category/:id
  //  @access Private [Amdin]
  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}