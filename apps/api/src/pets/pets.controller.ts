import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { PetsService, PetWithRelations } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать объявление о питомце' })
  async create(@CurrentUser() user: User, @Body() dto: CreatePetDto): Promise<PetWithRelations> {
    return this.petsService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех объявлений' })
  async findAll(): Promise<PetWithRelations[]> {
    return this.petsService.findAll();
  }
}
