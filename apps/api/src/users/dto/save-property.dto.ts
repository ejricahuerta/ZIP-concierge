import { IsString, MinLength } from 'class-validator';

export class SavePropertyDto {
  @IsString()
  @MinLength(1)
  propertyId: string;
}
