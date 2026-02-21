import { Controller, Get, Param, Query } from '@nestjs/common';
import { UniversitiesService } from './universities.service';

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  async list(@Query('city') city?: string) {
    const items = await this.universitiesService.findAll(city);
    return { success: true, data: items };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const university = await this.universitiesService.findOne(id);
    if (!university) return { success: false, error: 'Not found' };
    return { success: true, data: university };
  }
}
