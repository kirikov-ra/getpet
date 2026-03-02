import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { EncyclopediaService } from './encyclopedia.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Breed } from '@prisma/client';

@ApiTags('encyclopedia')
@Controller('encyclopedia')
export class EncyclopediaController {
  constructor(private readonly encyclopediaService: EncyclopediaService) {}

  @Post('breeds')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новую породу в справочнике' })
  async createBreed(@Body() dto: CreateBreedDto): Promise<Breed> {
    return await this.encyclopediaService.create(dto);
  }

  @Get('breeds/:slug')
  @ApiOperation({ summary: 'Получить детальную информацию о породе' })
  @ApiParam({ name: 'slug', description: 'Уникальный идентификатор породы (например: golden-retriever)' })
  async getBreedBySlug(@Param('slug') slug: string): Promise<Breed | null> {
    return await this.encyclopediaService.getBySlug(slug);
  }
}