import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UploadUrlDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(/^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/i, {
    message: 'Filename must end with .jpg, .jpeg, .png, or .webp',
  })
  filename: string;
}
