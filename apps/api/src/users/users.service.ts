import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { email: string; name?: string; password: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name ?? null,
        passwordHash,
        role: UserRole.STUDENT,
      },
    });
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        passwordHash: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        studentId: true,
        university: true,
        phone: true,
        preferredLanguage: true,
        country: true,
      },
    });
  }

  async getSavedProperties(userId: string) {
    return this.prisma.savedProperty.findMany({
      where: { userId },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            type: true,
            price: true,
            bedrooms: true,
            verified: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async saveProperty(userId: string, propertyId: string) {
    const exists = await this.prisma.property.findUnique({ where: { id: propertyId }, select: { id: true } });
    if (!exists) throw new NotFoundException('Property not found');
    return this.prisma.savedProperty.upsert({
      where: {
        userId_propertyId: { userId, propertyId },
      },
      update: {},
      create: { userId, propertyId },
    });
  }

  async removeSavedProperty(userId: string, propertyId: string) {
    return this.prisma.savedProperty.delete({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });
  }
}
