import { Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tax } from './tax.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaxService {
   
  constructor(@InjectModel(Tax.name) private taxModel:Model<Tax>){}

    async createOrUpdate(createTexDto: CreateTaxDto) {
    const tex = await this.taxModel.findOne({});
    if (!tex) {
      // Create New Tax
      const newTex = await this.taxModel.create(createTexDto);
      return {
        status: 200,
        message: 'Tax created successfully',
        data: newTex,
      };
    }
    // Update Tax
    const updateTex = await this.taxModel
      .findOneAndUpdate({}, createTexDto, {
        new: true,
      })
      .select('-__v');
    return {
      status: 200,
      message: 'Tax Updated successfully',
      data: updateTex,
    };
  }

  async find() {
    const tex = await this.taxModel.findOne({}).select('-__v');

    return {
      status: 200,
      message: 'Tax found successfully',
      data: tex,
    };
  }

  async reSet(): Promise<void> {
    await this.taxModel.findOneAndUpdate({}, { taxPrice: 0, shippingPrice: 0 });
  }
}
