import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './coupons.schema';
import { Model } from 'mongoose';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel:Model<Coupon>){}
// create coupon
  async create(createCouponDto: CreateCouponDto) {
    const coupon = await this.couponModel.findOne({ name: createCouponDto.name });
    if (coupon) {
      throw new HttpException('Coupon already exist', 400);
    }

    const newCoupon = await this.couponModel.create(createCouponDto);
    return {
      status: 200,
      message: 'Coupon created successfully',
      data: newCoupon,
    };
  }

  async findAll() {
    const coupons = await this.couponModel.find().select('-__v');
    return {
      status: 200,
      message: 'Coupons found',
      length: coupons.length,
      data: coupons,
    };
  }

  async findOne(id: string) {
    const coupon = await this.couponModel.findById(id).select('-__v');
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return {
      status: 200,
      message: 'Coupon found',
      data: coupon,
    };
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponModel.findById(id).select('-__v');
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const updatedCoupon = await this.couponModel.findByIdAndUpdate(
      id,
      updateCouponDto,
      {
        new: true,
      },
    );
    return {
      status: 200,
      message: 'Coupon updated successfully',
      data: updatedCoupon,
    };
  }

  async remove(id: string): Promise<void> {
    const coupon = await this.couponModel.findById(id).select('-__v');
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    await this.couponModel.findByIdAndDelete(id);
  }
}
