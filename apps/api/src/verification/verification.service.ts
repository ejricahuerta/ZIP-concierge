import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVerificationOrderDto } from './dto/create-verification-order.dto';
import { VerificationPackage } from '@prisma/client';

@Injectable()
export class VerificationService {
  constructor(private readonly prisma: PrismaService) {}

  getPackages() {
    return [
      {
        packageType: VerificationPackage.STANDARD,
        name: 'Standard Verification',
        price: 149,
        currency: 'USD',
      },
      {
        packageType: VerificationPackage.COMPREHENSIVE,
        name: 'Comprehensive Verification',
        price: 249,
        currency: 'USD',
      },
      {
        packageType: VerificationPackage.PREMIUM,
        name: 'Premium Verification',
        price: 399,
        currency: 'USD',
      },
    ];
  }

  async createOrder(userId: string, dto: CreateVerificationOrderDto) {
    const property = await this.prisma.property.findUnique({
      where: { id: dto.propertyId },
      select: { id: true },
    });
    if (!property) throw new NotFoundException('Property not found');

    return this.prisma.booking.create({
      data: {
        userId,
        propertyId: dto.propertyId,
        startDate: new Date(),
        endDate: new Date(),
        status: `PAID_${dto.packageType}`,
      },
      include: {
        property: {
          select: { id: true, title: true, city: true },
        },
      },
    });
  }

  async createCheckoutLink(userId: string, dto: CreateVerificationOrderDto) {
    if (dto.packageType !== VerificationPackage.STANDARD) {
      throw new BadRequestException('Hosted checkout currently supports Standard package only');
    }
    const property = await this.prisma.property.findUnique({
      where: { id: dto.propertyId },
      select: { id: true },
    });
    if (!property) throw new NotFoundException('Property not found');

    const pending = await this.prisma.booking.create({
      data: {
        userId,
        propertyId: dto.propertyId,
        startDate: new Date(),
        endDate: new Date(),
        status: 'PENDING_PAYMENT_STANDARD',
      },
      select: { id: true },
    });

    const baseLink =
      process.env.STRIPE_STANDARD_PAYMENT_LINK ??
      'https://buy.stripe.com/test_5kQ9AT5uAgSmanX1NaejK00';

    const checkoutUrl = `${baseLink}?client_reference_id=${encodeURIComponent(pending.id)}`;
    return { checkoutUrl, bookingId: pending.id };
  }

  async handleStripeWebhook(payload: any) {
    const eventType = payload?.type;
    if (eventType !== 'checkout.session.completed') {
      return { received: true, ignored: true };
    }

    const session = payload?.data?.object;
    const referenceId = session?.client_reference_id as string | undefined;
    const paid =
      session?.payment_status === 'paid' || session?.status === 'complete';

    if (!referenceId || !paid) {
      return { received: true, ignored: true };
    }

    await this.prisma.booking.updateMany({
      where: { id: referenceId, status: 'PENDING_PAYMENT_STANDARD' },
      data: { status: 'PAID_STANDARD' },
    });

    return { received: true };
  }

  async myOrders(userId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        userId,
        status: {
          startsWith: 'PAID_',
        },
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map((b) => ({
      id: b.id,
      packageType: b.status.replace('PAID_', ''),
      amount:
        b.status === 'PAID_STANDARD'
          ? 149
          : b.status === 'PAID_COMPREHENSIVE'
            ? 249
            : 399,
      currency: 'USD',
      status: 'PAID',
      createdAt: b.createdAt,
      property: b.property,
    }));
  }
}
