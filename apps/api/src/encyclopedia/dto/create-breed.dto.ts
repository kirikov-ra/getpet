import {
  IsString,
  IsUUID,
  IsArray,
  ArrayMaxSize,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class FlexibleFieldDto {
  @IsString()
  label: string;

  @IsString()
  value: string;
}

export class CreateBreedDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => FlexibleFieldDto)
  characteristics?: FlexibleFieldDto[];
}
