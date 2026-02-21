import { Controller, Get, Query, Param, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertyType } from '@prisma/client';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

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

  @Get(':id')
  async get(@Param('id') id: string) {
    const property = await this.propertiesService.findOne(id);
    if (!property) return { success: false, error: 'Not found' };
    return { success: true, data: property };
  }
}
