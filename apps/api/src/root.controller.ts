import { Controller, Get } from '@nestjs/common';

/**
 * Handles GET /api/v1 (base path) so the API root returns 200 instead of 404.
 */
@Controller()
export class RootController {
  @Get()
  root() {
    return {
      service: 'zip-api',
      version: '1',
      status: 'ok',
      health: '/api/v1/health',
    };
  }
}
