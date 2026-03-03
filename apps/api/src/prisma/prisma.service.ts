import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const pool = new Pool({
      connectionString: process.env['DATABASE_URL'],
    });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    try {
      this.logger.log('Установка соединения с базой данных (Prisma 7 + PG Adapter)...');
      await this.$connect();
      this.logger.log('✅ Соединение с БД успешно установлено.');
    } catch (error) {
      this.logger.error('❌ Ошибка подключения к БД:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
