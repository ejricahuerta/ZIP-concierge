import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PropertyType } from '@prisma/client';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { city?: string; type?: PropertyType; verified?: boolean; limit?: number; offset?: number }) {
    const where: Prisma.PropertyWhereInput = {};
    if (params.city) where.city = params.city;
    if (params.type) where.type = params.type;
    if (params.verified === true) {
      where.verificationReports = { some: { status: 'COMPLETED' } };
    } else if (params.verified === false) {
      where.NOT = { verificationReports: { some: { status: 'COMPLETED' } } };
    }
    const [rows, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        take: params.limit ?? 20,
        skip: params.offset ?? 0,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: { select: { id: true, name: true } },
          _count: { select: { savedBy: true } },
          verificationReports: { where: { status: 'COMPLETED' }, select: { id: true } },
        },
      }),
      this.prisma.property.count({ where }),
    ]);
    const items = rows.map((p) => {
      const { verificationReports, ...rest } = p;
      return { ...rest, verified: verificationReports.length > 0 };
    });
    return { items, total };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true } },
        nearbyUniversities: { include: { university: true } },
        verificationReports: { where: { status: 'COMPLETED' }, select: { id: true } },
      },
    });
    if (!property) return null;
    const { verificationReports, ...rest } = property;
    return { ...rest, verified: verificationReports.length > 0 };
  }

  async findByOwnerId(ownerId: string) {
    const rows = await this.prisma.property.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { savedBy: true } },
        nearbyUniversities: { include: { university: true } },
        verificationReports: { where: { status: 'COMPLETED' }, select: { id: true } },
      },
    });
    return rows.map((p) => {
      const { verificationReports, ...rest } = p;
      return { ...rest, verified: verificationReports.length > 0 };
    });
  }

  async create(ownerId: string, dto: CreatePropertyDto) {
    const { nearbyUniversities, ...data } = dto;
    const property = await this.prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        latitude: data.latitude,
        longitude: data.longitude,
        size: data.size,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        maxOccupants: data.maxOccupants,
        price: data.price,
        currency: data.currency ?? 'CAD',
        utilitiesIncluded: data.utilitiesIncluded ?? false,
        images: data.images ?? [],
        videos: data.videos ?? [],
        virtualTour: data.virtualTour ?? null,
        amenities: (data.amenities ?? undefined) as Prisma.InputJsonValue | undefined,
        ownerId,
      },
    });
    if (nearbyUniversities?.length) {
      await this.prisma.universityProximity.createMany({
        data: nearbyUniversities.map((n) => ({
          propertyId: property.id,
          universityId: n.universityId,
          distanceKm: n.distanceKm,
        })),
      });
    }
    return this.findOne(property.id);
  }

  async update(propertyId: string, userId: string, dto: UpdatePropertyDto) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, ownerId: true },
    });
    if (!property) throw new NotFoundException('Property not found');
    if (property.ownerId !== userId) throw new ForbiddenException('You can only edit your own listings');

    const { nearbyUniversities, ...rest } = dto;
    if (nearbyUniversities !== undefined) {
      await this.prisma.universityProximity.deleteMany({ where: { propertyId } });
      if (nearbyUniversities.length > 0) {
        await this.prisma.universityProximity.createMany({
          data: nearbyUniversities.map((n) => ({
            propertyId,
            universityId: n.universityId,
            distanceKm: n.distanceKm,
          })),
        });
      }
    }
    const raw = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (Object.keys(raw).length > 0) {
      const updateData = { ...raw } as Record<string, unknown>;
      if (updateData.amenities !== undefined) {
        updateData.amenities = updateData.amenities as Prisma.InputJsonValue;
      }
      await this.prisma.property.update({
        where: { id: propertyId },
        data: updateData as Prisma.PropertyUpdateInput,
      });
    }
    return this.findOne(propertyId);
  }
}
