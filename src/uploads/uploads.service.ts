// upload/upload.service.ts
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Express } from 'express';
import * as streamifier from 'streamifier';
import { Image, ImageDocument } from './image.schema';

export interface UploadOptions {
  folder?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  generateSizes?: boolean;
  allowedFormats?: string[];
  maxFileSize?: number;
}

@Injectable()
export class UploadService {
  private readonly defaultOptions: UploadOptions = {
    folder: 'uploads',
    maxWidth: 2000,
    maxHeight: 2000,
    quality: 90,
    generateSizes: true,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  };

  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  /**
   * Upload single image
   */
  async uploadImage(
    file: any,
    options?: UploadOptions,
  ): Promise<ImageDocument> {
    const opts = { ...this.defaultOptions, ...options };

    // Validate file
    this.validateFile(file, opts);

    // Upload to Cloudinary
    const uploadResult = await this.uploadToCloudinary(file, opts);

    // Generate different sizes URLs
    const urls = this.generateImageUrls(uploadResult.public_id, opts.generateSizes);

    // Save to database
    const image = new this.imageModel({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      thumbnailUrl: urls.thumbnail,
      mediumUrl: urls.medium,
      largeUrl: urls.large,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
    });

    return await image.save();
  }

  /**
   * Upload multiple images
   */
  async uploadImages(
    files: any,
    options?: UploadOptions,
  ): Promise<ImageDocument[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, options));
    return await Promise.all(uploadPromises);
  }

  // /**
  //  * Delete image
  //  */
  async deleteImage(imageId: string) {
    const image = await this.imageModel.findById(imageId);
    if (!image) {
      throw new BadRequestException('Image not found');
    }

  //   // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Delete from database
    await image.deleteOne();
    return image
    
  }

  // /**
  //  * Delete multiple images
  //  */
  async deleteImages(imageIds: string[]): Promise<void> {
    const images = await this.imageModel.find({ _id: { $in: imageIds } });
    
    if (images.length === 0) return;

    // Delete from Cloudinary
    const publicIds = images.map((img) => img.publicId);
    await cloudinary.api.delete_resources(publicIds);

    // Delete from database
    await this.imageModel.deleteMany({ _id: { $in: imageIds } });
  }

  // /**
  //  * Get image by ID
  //  */
  async getImage(imageId: string): Promise<ImageDocument> {
    const image = await this.imageModel.findById(imageId);
    if (!image) {
      throw new BadRequestException('Image not found');
    }
    return image;
  }

  // /**
  //  * Update image metadata
  //  */
  async updateImageMetadata(
    imageId: string,
    metadata: { alt?: string; metadata?: Record<string, any> },
  ): Promise<ImageDocument> {
    const image = await this.imageModel.findByIdAndUpdate(
      imageId,
      { $set: metadata },
      { new: true },
    );

    if (!image) {
      throw new BadRequestException('Image not found');
    }

    return image;
  }

  // /**
  //  * Private methods
  //  */

  // validation file
  private validateFile(file: any, options: UploadOptions): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Check file size
    if (file.size > options.maxFileSize!) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${options.maxFileSize! / 1024 / 1024}MB`,
      );
    }

    // Check file type
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (!fileExtension || !options.allowedFormats!.includes(fileExtension)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: ${options.allowedFormats!.join(', ')}`,
      );
    }
  }
// upload to cloudinary
  private uploadToCloudinary(
    file: any,
    options: UploadOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder,
          transformation: [
            {
              width: options.maxWidth,
              height: options.maxHeight,
              crop: 'limit',
              quality: options.quality,
              fetch_format: 'auto',
            },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
// generate image url
  private generateImageUrls(publicId: string, generateSizes: boolean = true) {
    if (!generateSizes) {
      return {
        thumbnail: null,
        medium: null,
        large: null,
      };
    }

    return {
      thumbnail: cloudinary.url(publicId, {
        width: 200,
        height: 200,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
        secure: true,
      }),
      medium: cloudinary.url(publicId, {
        width: 600,
        height: 600,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
        secure: true,
      }),
      large: cloudinary.url(publicId, {
        width: 1200,
        height: 1200,
        crop: 'limit',
        quality: 'auto:best',
        fetch_format: 'auto',
        secure: true,
      }),
    };
  }

}