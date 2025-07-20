// upload/upload.module.ts
import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UploadService } from './uploads.service';
import { UploadController } from './uploads.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { Image, ImageSchema } from './image.schema';

@Global() 
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [UploadController],
  providers: [CloudinaryProvider, UploadService],
  exports: [UploadService], 
})

export class UploadsModule {}
