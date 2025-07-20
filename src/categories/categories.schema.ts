import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Image } from '../uploads/image.schema';

export type categoryDocument=HydratedDocument<Category>

@Schema({timestamps:true})
export class Category {
    @Prop({
    required: true,
    min: [3, 'Name must be at least 3 characters'],
    max: [30, 'Name must be at most 30 characters'],
    })
    name:string
     @Prop({
    type: String,
  })
    @Prop({ type:mongoose.Schema.Types.ObjectId, ref: 'Image' })
  image: Image;
}

export const categorySchema=SchemaFactory.createForClass(Category)