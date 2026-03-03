import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { Prisma } from '@prisma/client';

export type PetWithRelations = Prisma.PetGetPayload<{
  include: { images: true; category: true; breed: true };
}>;

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(currentUserId: string, dto: CreatePetDto): Promise<PetWithRelations> {
    const targetShelterId = dto.shelterId || null;
    const targetOwnerId = targetShelterId ? null : currentUserId;

    if ((targetOwnerId && targetShelterId) || (!targetOwnerId && !targetShelterId)) {
      throw new BadRequestException(
        'Ошибка валидации: объявление должно быть привязано либо к частному лицу, либо к приюту.',
      );
    }

    const tagsJson = dto.tags ? (dto.tags as unknown as Prisma.InputJsonArray) : Prisma.JsonNull;

    const imagesData =
      dto.images && dto.images.length > 0
        ? {
            create: dto.images.map((img) => ({
              url: img.url,
              isPrimary: img.isPrimary || false,
            })),
          }
        : undefined;

    const pet = await this.prisma.pet.create({
      data: {
        name: dto.name,
        categoryId: dto.categoryId,
        description: dto.description,
        city: dto.city,

        breedId: dto.breedId,
        customBreed: dto.customBreed,
        region: dto.region,
        address: dto.address,

        ownerId: targetOwnerId,
        shelterId: targetShelterId,

        gender: dto.gender || 'UNKNOWN',
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        weight: dto.weight,
        height: dto.height,
        isSterilized: dto.isSterilized || false,
        isVaccinated: dto.isVaccinated || false,
        chipNumber: dto.chipNumber,
        tags: tagsJson,

        images: imagesData,
      },
      include: {
        images: true,
        category: true,
        breed: true,
      },
    });

    return pet;
  }

  async findAll(): Promise<PetWithRelations[]> {
    return await this.prisma.pet.findMany({
      where: { deletedAt: null },
      include: { images: true, category: true, breed: true },
    });
  }
}
