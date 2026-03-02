import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { Prisma } from '@prisma/client';

export type PetWithRelations = Prisma.PetGetPayload<{
  include: { images: true; category: true };
}>;

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreatePetDto): Promise<PetWithRelations> {
    const { images, ...petData } = dto;

    return await this.prisma.pet.create({
      data: {
        ...petData,
        ownerId,
        images: {
          create: images.map((img) => ({
            url: img.url,
            isPrimary: img.isPrimary || false,
          })),
        },
      },
      include: {
        images: true,
        category: true,
      },
    });
  }

  async findAll(): Promise<PetWithRelations[]> {
    return await this.prisma.pet.findMany({
      where: { deletedAt: null },
      include: { images: true, category: true },
    });
  }
}
