import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, HttpException } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  //  @docs   Admin Can create a new Coupon
  //  @Route  POST /api/v1/coupon
  //  @access Private [Amdin]
  @Post()
  @Roles('admin')
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCouponDto: CreateCouponDto,
  ) {
    const isExpired = new Date(createCouponDto.expireDate) > new Date();
    if (!isExpired) {
      throw new HttpException("Coupon can't be expired", 400);
    }
    return this.couponsService.create(createCouponDto);
  }

  //  @docs   Admin Can get all Coupons
  //  @Route  GET /api/v1/coupon
  //  @access Private [Amdin]
  @Get()
  @Roles('admin')
  @UseGuards(AuthGuard)
  findAll() {
    return this.couponsService.findAll();
  }

  //  @docs   Admin Can get one Coupon
  //  @Route  GET /api/v1/coupon
  //  @access Private [Amdin]
  @Get(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  //  @docs   Admin can update a coupon
  //  @Route  PATCH /api/v1/coupon
  //  @access Private [admin]
  @Patch(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCouponDto: UpdateCouponDto,
  ) {
    const isExpired = new Date(updateCouponDto.expireDate) > new Date();
    if (!isExpired) {
      throw new HttpException("Coupon can't be expired", 400);
    }
    return this.couponsService.update(id, updateCouponDto);
  }

  //  @docs   Admin can delete a Coupon
  //  @Route  DELETE /api/v1/coupon
  //  @access Private [admin]
  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
