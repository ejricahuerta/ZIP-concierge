import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    // In serverless (e.g. Vercel), skip disconnect so the connection can be reused
    // across warm invocations; avoids connection churn and pool exhaustion.
    if (process.env.VERCEL !== '1') {
      await this.$disconnect();
    }
  }
}
