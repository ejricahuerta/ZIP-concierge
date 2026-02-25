import { IsBoolean, IsOptional, IsString } from 'class-validator';

/**
 * Amenities shape for international-student-focused listings.
 * Stored in Property.amenities as JSON.
 */
export class AmenitiesDto {
  @IsOptional()
  @IsBoolean()
  wifi?: boolean;

  @IsOptional()
  @IsBoolean()
  laundry?: boolean;

  @IsOptional()
  @IsBoolean()
  furnished?: boolean;

  @IsOptional()
  @IsBoolean()
  gym?: boolean;

  /** e.g. "none" | "street" | "included" | "paid" */
  @IsOptional()
  @IsString()
  parking?: string;

  @IsOptional()
  @IsBoolean()
  petFriendly?: boolean;

  @IsOptional()
  @IsBoolean()
  schoolZone?: boolean;

  @IsOptional()
  @IsBoolean()
  airConditioning?: boolean;

  @IsOptional()
  @IsBoolean()
  dishwasher?: boolean;
}
