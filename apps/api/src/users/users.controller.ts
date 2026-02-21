import { Controller, Get, Delete, Param, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SavePropertyDto } from './dto/save-property.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user: { id: string }) {
    const data = await this.usersService.findById(user.id);
    return { success: true, data: { user: data } };
  }

  @Get('me/saved')
  async mySaved(@CurrentUser() user: { id: string }) {
    const data = await this.usersService.getSavedProperties(user.id);
    return { success: true, data };
  }

  @Post('me/saved')
  async save(@CurrentUser() user: { id: string }, @Body() dto: SavePropertyDto) {
    await this.usersService.saveProperty(user.id, dto.propertyId);
    return { success: true };
  }

  @Delete('me/saved/:propertyId')
  async removeSaved(@CurrentUser() user: { id: string }, @Param('propertyId') propertyId: string) {
    await this.usersService.removeSavedProperty(user.id, propertyId);
    return { success: true };
  }
}
