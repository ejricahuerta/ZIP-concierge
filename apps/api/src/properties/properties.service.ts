import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyType, PropertyStatus } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { city?: string; type?: PropertyType; verified?: boolean; limit?: number; offset?: number }) {
    const where: Record<string, unknown> = {};
    if (params.city) where.city = params.city;
    if (params.type) where.type = params.type;
    if (params.verified != null) where.verified = params.verified;
    const [items, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        take: params.limit ?? 20,
        skip: params.offset ?? 0,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: { select: { id: true, name: true } },
          _count: { select: { savedBy: true } },
        },
      }),
      this.prisma.property.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true } },
        nearbyUniversities: { include: { university: true } },
      },
    });
  }
}
