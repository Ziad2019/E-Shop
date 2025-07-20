import { Max, Min,IsString,IsUrl,IsOptional, MinLength, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @MinLength(3,{message:'Name must be at least 3 characters'})
    @MaxLength(30,{message:'Name must be at most 30 characters'})
    name:string
    @IsString({ message: 'image must be a string' })
    @IsUrl({}, { message: 'image must be a valid URL' })
    @IsOptional()
  image: string;
}
