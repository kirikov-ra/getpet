import { IsString, IsOptional, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PetImageDto {
  @IsString()
  url: string;

  @IsOptional()
  @Type(() => Boolean)
  isPrimary?: boolean;
}

export class CreatePetDto {
  @IsString()
  name: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsUUID()
  breedId?: string;

  @IsOptional()
  @IsString()
  customBreed?: string;

  @IsString()
  description: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PetImageDto)
  images: PetImageDto[];
}
