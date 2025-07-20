import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('subCategories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

   //  @docs   Admin Can create a new sub category
  //  @Route  POST /api/v1/subCategory
  //  @access Private [Amdin]
  @Post()
  @Roles('admin')
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    CreateSubCategoryDto: CreateSubCategoryDto,
  ) {
    return this.subCategoriesService.create(CreateSubCategoryDto);
  }

  //  @docs   Any User Can get sub categorys
  //  @Route  GET /api/v1/sub-category
  //  @access Public
  @Get()
  findAll() {
    return this.subCategoriesService.findAll();
  }

  //  @docs   Any User Can get any sub category
  //  @Route  GET /api/v1/sub-category/:id
  //  @access Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoriesService.findOne(id);
  }

  //  @docs   Admin Can update any sub category
  //  @Route  UPDATE /api/v1/sub-category/:id
  //  @access Private [Amdin]
  @Patch(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    UpdateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoriesService.update(id, UpdateSubCategoryDto);
  }

  //  @docs   Admin Can delete any sub category
  //  @Route  DELETE /api/v1/sub-category/:id
  //  @access Private [Amdin]
  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.subCategoriesService.remove(id);
  }
}

