import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(city?: string) {
    const where = city ? { city } : {};
    return this.prisma.university.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.university.findUnique({
      where: { id },
      include: { _count: { select: { proximity: true } } },
    });
  }
}
