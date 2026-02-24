import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { SupabaseService } from '../supabase/supabase.service';
import { PropertyType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { UploadUrlDto } from './dto/upload-url.dto';
import { randomUUID } from 'crypto';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly supabase: SupabaseService,
  ) {}

  @Get()
  async list(
    @Query('city') city?: string,
    @Query('type') type?: PropertyType,
    @Query('verified') verified?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    const verifiedBool = verified === 'true' ? true : verified === 'false' ? false : undefined;
    const { items, total } = await this.propertiesService.findAll({
      city,
      type,
      verified: verifiedBool,
      limit,
      offset,
    });
    return { success: true, data: items, meta: { total, limit, offset } };
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: { id: string }) {
    const items = await this.propertiesService.findByOwnerId(user.id);
    return { success: true, data: items };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const property = await this.propertiesService.findOne(id);
    if (!property) return { success: false, error: 'Not found' };
    return { success: true, data: property };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: { id: string }, @Body() dto: CreatePropertyDto) {
    const property = await this.propertiesService.create(user.id, dto);
    return { success: true, data: property };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdatePropertyDto,
  ) {
    const property = await this.propertiesService.update(id, user.id, dto);
    return { success: true, data: property };
  }

  @Post(':id/upload-url')
  @UseGuards(JwtAuthGuard)
  async uploadUrl(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UploadUrlDto,
  ) {
    const property = await this.propertiesService.findOne(id);
    if (!property) return { success: false, error: 'Not found' };
    if (property.owner.id !== user.id) return { success: false, error: 'Forbidden' };
    const ext = dto.filename.replace(/^.*\./, '').toLowerCase();
    const path = `${id}/${randomUUID()}.${ext}`;
    const { path: storedPath, token } = await this.supabase.createSignedUploadUrl(path);
    const publicUrl = this.supabase.getPublicUrl(storedPath);
    return {
      success: true,
      data: { path: storedPath, token, publicUrl },
    };
  }
}
