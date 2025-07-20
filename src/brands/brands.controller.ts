import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  //  @docs   Admin Can create a new Brand
  //  @Route  POST /api/v1/brand
  //  @access Private [Amdin]
  @Post()
  @Roles('admin')
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createBrandDto: CreateBrandDto,
  ) {
    return this.brandsService.create(createBrandDto);
  }

  //  @docs   Any User Can get all Brands
  //  @Route  GET /api/v1/brand
  //  @access Public
  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  //  @docs   Any User Can get single Brand
  //  @Route  GET /api/v1/brand
  //  @access Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  //  @docs   Admin can update a Brand
  //  @Route  PATCH /api/v1/brand
  //  @access Private [admin]
  @Patch(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateBrandDto);
  }

  //  @docs   Admin can delete a Brand
  //  @Route  DELETE /api/v1/brand
  //  @access Private [admin]
  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
