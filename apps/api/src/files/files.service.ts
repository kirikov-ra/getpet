import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

@Injectable()
export class FilesService {
  private s3Client: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET_NAME?.trim() || 'pets';

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_S3_REGION?.trim() || 'ru-central1',
      endpoint: process.env.AWS_S3_ENDPOINT?.trim(),
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim() || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim() || '',
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const optimizedBuffer = await sharp(file.buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const filename = `${randomUUID()}.webp`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: optimizedBuffer,
        ContentType: 'image/webp',
      });

      await this.s3Client.send(command);

      return `${process.env.AWS_S3_ENDPOINT?.trim()}/${this.bucketName}/${filename}`;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));

      console.error('❌ ОШИБКА В S3/SHARP:', err.message, err.stack);

      throw new InternalServerErrorException('Не удалось обработать и загрузить изображение');
    }
  }
}
