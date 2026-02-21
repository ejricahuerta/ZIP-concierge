import { IsEnum, IsString, MinLength } from 'class-validator';
import { VerificationPackage } from '@prisma/client';

export class CreateVerificationOrderDto {
  @IsString()
  @MinLength(1)
  propertyId: string;

  @IsEnum(VerificationPackage)
  packageType: VerificationPackage;
}
