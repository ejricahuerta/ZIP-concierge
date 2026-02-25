import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType } from '@prisma/client';
import { UniversityProximityDto } from './university-proximity.dto';

export class CreatePropertyDto {
  @IsString()
  @MinLength(1, { message: 'Title is required' })
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(1, { message: 'Description is required' })
  @MaxLength(10000)
  description: string;

  @IsEnum(PropertyType)
  type: PropertyType;

  @IsString()
  @MinLength(1)
  address: string;

  @IsString()
  @MinLength(1)
  city: string;

  @IsString()
  @MinLength(1)
  province: string;

  @IsString()
  @MinLength(1)
  postalCode: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  @Min(0)
  size: number;

  @IsNumber()
  @Min(0)
  bedrooms: number;

  @IsNumber()
  @Min(0)
  bathrooms: number;

  @IsNumber()
  @Min(1)
  maxOccupants: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  utilitiesIncluded?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];

  @IsOptional()
  @IsString()
  virtualTour?: string;

  @IsOptional()
  amenities?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UniversityProximityDto)
  nearbyUniversities?: UniversityProximityDto[];
}
