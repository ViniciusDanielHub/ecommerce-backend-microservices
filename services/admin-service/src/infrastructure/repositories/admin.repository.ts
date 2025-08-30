import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getSystemConfig(key: string): Promise<string | null> {
    const config = await this.prisma.systemConfig.findUnique({
      where: { key },
    });
    return config?.value || null;
  }

  async setSystemConfig(key: string, value: string): Promise<void> {
    await this.prisma.systemConfig.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value },
    });
  }

  async logAdminAction(data: {
    adminId: string;
    action: string;
    targetId?: string;
    targetType?: string;
    description: string;
    metadata?: any;
    ip?: string;
    userAgent?: string;
  }): Promise<void> {
    await this.prisma.adminLog.create({
      data,
    });
  }

  async getAdminLogs(adminId?: string, limit: number = 50) {
    return this.prisma.adminLog.findMany({
      where: adminId ? { adminId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
