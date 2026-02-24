import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { UniversitiesModule } from './universities/universities.module';
import { HealthModule } from './health/health.module';
import { VerificationModule } from './verification/verification.module';
import { RootController } from './root.controller';

@Module({
  controllers: [RootController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    UniversitiesModule,
    HealthModule,
    VerificationModule,
  ],
})
export class AppModule {}
