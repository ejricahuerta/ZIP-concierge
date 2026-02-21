import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateVerificationOrderDto } from './dto/create-verification-order.dto';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get('packages')
  packages() {
    return { success: true, data: this.verificationService.getPackages() };
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders')
  async createOrder(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateVerificationOrderDto,
  ) {
    const data = await this.verificationService.createOrder(user.id, dto);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout-link')
  async checkoutLink(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateVerificationOrderDto,
  ) {
    const data = await this.verificationService.createCheckoutLink(user.id, dto);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders/me')
  async myOrders(@CurrentUser() user: { id: string }) {
    const data = await this.verificationService.myOrders(user.id);
    return { success: true, data };
  }

  @Post('webhooks/stripe')
  async stripeWebhook(@Body() payload: any) {
    const data = await this.verificationService.handleStripeWebhook(payload);
    return { success: true, data };
  }
}
