import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ContactService } from './contact.service';

class SubscribeDto {
  @IsEmail()
  email: string;
}

class BookVerificationDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  property: string;

  @IsOptional()
  @IsString()
  viewing?: string;

  @IsOptional()
  @IsString()
  message?: string;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('subscribe')
  @HttpCode(200)
  async subscribe(@Body() body: SubscribeDto) {
    await this.contactService.subscribe(body.email);
    return { success: true };
  }

  @Post('book')
  @HttpCode(200)
  async bookVerification(@Body() body: BookVerificationDto) {
    await this.contactService.bookVerification(body);
    return { success: true };
  }
}
