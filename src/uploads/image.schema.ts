// schemas/image.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema({ timestamps: true })
export class Image {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;

  @Prop()
  thumbnailUrl: string;

  @Prop()
  mediumUrl: string;

  @Prop()
  largeUrl: string;

  @Prop({ required: true })
  format: string;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  bytes: number;

  @Prop()
  alt: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const ImageSchema = SchemaFactory.createForClass(Image);