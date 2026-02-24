const { PrismaClient, PropertyType, UserRole, VerificationPackage, VerificationStatus } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const ownerPasswordHash = await bcrypt.hash("Password123!", 10);
  const studentPasswordHash = await bcrypt.hash("Password123!", 10);

  const owner = await prisma.user.upsert({
    where: { email: "owner@zipconcierge.dev" },
    update: {
      name: "ZIP Property Owner",
      role: UserRole.PROPERTY_OWNER,
      passwordHash: ownerPasswordHash,
    },
    create: {
      email: "owner@zipconcierge.dev",
      name: "ZIP Property Owner",
      role: UserRole.PROPERTY_OWNER,
      passwordHash: ownerPasswordHash,
      country: "Canada",
      preferredLanguage: "en",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@zipconcierge.dev" },
    update: {
      name: "ZIP Student Demo",
      role: UserRole.STUDENT,
      passwordHash: studentPasswordHash,
      university: "University of Toronto",
    },
    create: {
      email: "student@zipconcierge.dev",
      name: "ZIP Student Demo",
      role: UserRole.STUDENT,
      passwordHash: studentPasswordHash,
      university: "University of Toronto",
      country: "Korea",
      preferredLanguage: "en",
    },
  });

  const universities = await Promise.all([
    prisma.university.upsert({
      where: { id: "seed-uoft" },
      update: {
        name: "University of Toronto",
        shortName: "UofT",
        city: "Toronto",
        province: "ON",
        latitude: 43.6629,
        longitude: -79.3957,
        website: "https://www.utoronto.ca",
      },
      create: {
        id: "seed-uoft",
        name: "University of Toronto",
        shortName: "UofT",
        city: "Toronto",
        province: "ON",
        latitude: 43.6629,
        longitude: -79.3957,
        website: "https://www.utoronto.ca",
      },
    }),
    prisma.university.upsert({
      where: { id: "seed-york" },
      update: {
        name: "York University",
        shortName: "York",
        city: "Toronto",
        province: "ON",
        latitude: 43.7735,
        longitude: -79.5019,
        website: "https://www.yorku.ca",
      },
      create: {
        id: "seed-york",
        name: "York University",
        shortName: "York",
        city: "Toronto",
        province: "ON",
        latitude: 43.7735,
        longitude: -79.5019,
        website: "https://www.yorku.ca",
      },
    }),
  ]);

  await prisma.universityProximity.deleteMany({
    where: { property: { ownerId: owner.id } },
  });

  const ownerPropertyIds = (await prisma.property.findMany({ where: { ownerId: owner.id }, select: { id: true } })).map((p) => p.id);
  if (ownerPropertyIds.length > 0) {
    await prisma.verificationReport.deleteMany({ where: { propertyId: { in: ownerPropertyIds } } });
    await prisma.booking.deleteMany({ where: { propertyId: { in: ownerPropertyIds } } });
  }

  await prisma.property.deleteMany({
    where: { ownerId: owner.id },
  });

  const sampleProperties = [
    {
      title: "Downtown Verified Studio Near UofT",
      description: "Fully furnished studio with fast Wi-Fi and all utilities included. Ideal for international students.",
      type: PropertyType.STUDIO,
      address: "101 College St",
      city: "Toronto",
      province: "ON",
      postalCode: "M5G 1L7",
      latitude: 43.6602,
      longitude: -79.3895,
      size: 420,
      bedrooms: 1,
      bathrooms: 1,
      maxOccupants: 1,
      price: 2100,
      utilitiesIncluded: true,
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
      ],
      videos: [],
      amenities: { wifi: true, laundry: true, furnished: true, gym: false },
      nearby: [{ universityId: universities[0].id, distanceKm: 0.8 }],
      packageType: VerificationPackage.COMPREHENSIVE,
    },
    {
      title: "Shared Condo Room in North York",
      description: "Private bedroom in a shared condo. Great transit access to York University and downtown.",
      type: PropertyType.SHARED,
      address: "2500 Finch Ave W",
      city: "Toronto",
      province: "ON",
      postalCode: "M9M 2G2",
      latitude: 43.7489,
      longitude: -79.5282,
      size: 300,
      bedrooms: 1,
      bathrooms: 1,
      maxOccupants: 1,
      price: 1250,
      utilitiesIncluded: false,
      images: [
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
      ],
      videos: [],
      amenities: { wifi: true, laundry: true, furnished: false, gym: true },
      nearby: [{ universityId: universities[1].id, distanceKm: 2.1 }],
      packageType: null,
    },
    {
      title: "Private 2-Bed Apartment by Transit",
      description: "Bright 2-bedroom apartment with modern kitchen and easy subway access. Perfect for roommates.",
      type: PropertyType.PRIVATE,
      address: "45 Bloor St E",
      city: "Toronto",
      province: "ON",
      postalCode: "M4W 1A9",
      latitude: 43.6703,
      longitude: -79.3859,
      size: 780,
      bedrooms: 2,
      bathrooms: 1,
      maxOccupants: 2,
      price: 2950,
      utilitiesIncluded: true,
      images: [
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop",
      ],
      videos: [],
      amenities: { wifi: true, laundry: true, furnished: true, gym: true },
      nearby: [
        { universityId: universities[0].id, distanceKm: 1.5 },
        { universityId: universities[1].id, distanceKm: 10.3 },
      ],
      packageType: VerificationPackage.STANDARD,
    },
  ];

  for (const data of sampleProperties) {
    const created = await prisma.property.create({
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
        utilitiesIncluded: data.utilitiesIncluded,
        images: data.images,
        videos: data.videos,
        amenities: data.amenities,
        ownerId: owner.id,
      },
    });

    for (const near of data.nearby) {
      await prisma.universityProximity.create({
        data: {
          propertyId: created.id,
          universityId: near.universityId,
          distanceKm: near.distanceKm,
        },
      });
    }

    if (data.packageType) {
      const booking = await prisma.booking.create({
        data: {
          userId: student.id,
          propertyId: created.id,
          startDate: new Date(),
          endDate: new Date(),
          status: `PAID_${data.packageType}`,
        },
      });
      await prisma.verificationReport.create({
        data: {
          propertyId: created.id,
          bookingId: booking.id,
          packageType: data.packageType,
          status: VerificationStatus.COMPLETED,
          photos: created.images,
          videos: [],
          notes: "Seeded verification report for demo purposes.",
          completedDate: new Date(),
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log("Owner login: owner@zipconcierge.dev / Password123!");
  console.log("Student login: student@zipconcierge.dev / Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
