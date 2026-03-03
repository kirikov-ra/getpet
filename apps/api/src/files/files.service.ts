import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

@Injectable()
export class FilesService {
  private s3Client: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET_NAME;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_S3_REGION,
      endpoint: process.env.AWS_S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const optimizedBuffer = await sharp(file.buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const filename = `${randomUUID()}.webp`;

      // 3. Отправка в S3
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: optimizedBuffer,
        ContentType: 'image/webp',
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      return `${process.env.AWS_S3_ENDPOINT}/${this.bucketName}/${filename}`;
    } catch (error) {
      console.error('Ошибка обработки или загрузки в S3:', error);
      throw new InternalServerErrorException('Не удалось обработать и загрузить изображение');
    }
  }
}
