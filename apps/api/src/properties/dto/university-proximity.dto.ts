import { IsNumber, IsString, Min } from 'class-validator';

export class UniversityProximityDto {
  @IsString()
  universityId: string;

  @IsNumber()
  @Min(0)
  distanceKm: number;
}
