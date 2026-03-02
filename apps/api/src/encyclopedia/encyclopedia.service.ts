import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { Breed, Prisma } from '@prisma/client';

@Injectable()
export class EncyclopediaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBreedDto): Promise<Breed> {
    const characteristicsJson = dto.characteristics
      ? (dto.characteristics as unknown as Prisma.InputJsonArray)
      : Prisma.JsonNull;

    return await this.prisma.breed.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        categoryId: dto.categoryId,
        description: dto.description,
        characteristics: characteristicsJson,
      },
    });
  }

  async getBySlug(slug: string): Promise<Breed | null> {
    return await this.prisma.breed.findUnique({
      where: { slug },
      include: { category: true },
    });
  }
}
