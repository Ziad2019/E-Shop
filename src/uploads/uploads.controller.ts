// upload/upload.controller.ts
import {
  Controller,
  Post,
  Delete,
  Get,
  Put,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadService, UploadOptions } from './uploads.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file:any,
    @Body() options?: UploadOptions,
  ) {
    const image = await this.uploadService.uploadImage(file, options);
    return {
      success: true,
      data: image,
    };
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(
    @UploadedFiles() files: any,
    @Body() options?: UploadOptions,
  ) {
    const images = await this.uploadService.uploadImages(files, options);
    return {
      success: true,
      data: images,
    };
  }

  @Delete(':id')
  async deleteImage(@Param('id') id: string) {
    return await this.uploadService.deleteImage(id);
  }

  @Get(':id')
  async getImage(@Param('id') id: string) {
    const image = await this.uploadService.getImage(id);
    return {
      success: true,
      data: image,
    };
  }

  @Put(':id/metadata')
  async updateImageMetadata(
    @Param('id') id: string,
    @Body() metadata: { alt?: string; metadata?: Record<string, any> },
  ) {
    const image = await this.uploadService.updateImageMetadata(id, metadata);
    return {
      success: true,
      data: image,
    };
  }
}