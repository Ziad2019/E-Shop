import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
      @IsNumber({}, { message: 'sold Must be a Number' })
      @IsOptional()
      sold: number;
}
