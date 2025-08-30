import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User } from '../../domain/entities/user.entity';

export interface UpdateUserProfileData {
  name?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  birthDate?: Date;
  bio?: string;
  preferences?: any;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<User | null> {
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) return null;

    return new User(
      userProfile.id,
      userProfile.userId,
      userProfile.name,
      userProfile.email,
      userProfile.role,
      userProfile.avatar,
      userProfile.phone,
      userProfile.address,
      userProfile.city,
      userProfile.state,
      userProfile.zipCode,
      userProfile.country,
      userProfile.birthDate,
      userProfile.bio,
      userProfile.preferences,
      userProfile.isActive,
      userProfile.createdAt,
      userProfile.updatedAt,
    );
  }

  async createProfile(data: {
    userId: string;
    name: string;
    email: string;
    role: string;
  }): Promise<User> {
    const userProfile = await this.prisma.userProfile.create({
      data: {
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role as any,
      },
    });

    return new User(
      userProfile.id,
      userProfile.userId,
      userProfile.name,
      userProfile.email,
      userProfile.role,
      userProfile.avatar,
      userProfile.phone,
      userProfile.address,
      userProfile.city,
      userProfile.state,
      userProfile.zipCode,
      userProfile.country,
      userProfile.birthDate,
      userProfile.bio,
      userProfile.preferences,
      userProfile.isActive,
      userProfile.createdAt,
      userProfile.updatedAt,
    );
  }

  async updateProfile(userId: string, data: UpdateUserProfileData): Promise<User> {
    const userProfile = await this.prisma.userProfile.update({
      where: { userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return new User(
      userProfile.id,
      userProfile.userId,
      userProfile.name,
      userProfile.email,
      userProfile.role,
      userProfile.avatar,
      userProfile.phone,
      userProfile.address,
      userProfile.city,
      userProfile.state,
      userProfile.zipCode,
      userProfile.country,
      userProfile.birthDate,
      userProfile.bio,
      userProfile.preferences,
      userProfile.isActive,
      userProfile.createdAt,
      userProfile.updatedAt,
    );
  }

  async logActivity(userId: string, action: string, description?: string, metadata?: any): Promise<void> {
    await this.prisma.userActivity.create({
      data: {
        userId,
        action,
        description,
        metadata,
      },
    });
  }
}
