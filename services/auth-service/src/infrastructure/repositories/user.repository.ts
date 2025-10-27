import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Role, User } from '@prisma/client'; // ✅ Importar tipos do Prisma
import { UserEntity } from '../../domain/entities/user.entity';
import { Role as PrismaRole } from '@prisma/client';
import { Role as DomainRole } from '../../shared/types';

export interface IUserRepository {
  create(data: {
    name: string;
    email: string;
    password: string;
    role?: Role
  }): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  updateRefreshToken(userId: string, token: string | null): Promise<void>;
  findAll(): Promise<UserEntity[]>;
  deleteUser(id: string): Promise<void>;
  updateRole(userId: string, role: Role): Promise<UserEntity>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  private convertRole(prismaRole: PrismaRole): DomainRole {
    switch (prismaRole) {
      case 'USER':
        return DomainRole.USER;
      case 'ADMIN':
        return DomainRole.ADMIN;
      case 'SELLER':
        return DomainRole.SELLER;
      default:
        throw new Error(`Unknown role: ${prismaRole}`);
    }
  }

  // ✅ Agora com tipagem correta do Prisma
  private toEntity(userData: User): UserEntity {
    return new UserEntity(
      userData.id,
      userData.name,
      userData.email,
      userData.password,
      this.convertRole(userData.role), 
      userData.isActive,
      userData.refreshToken,
      userData.resetPasswordToken,
      userData.resetPasswordExpires,
      userData.lastLoginAt,
      userData.emailVerifiedAt,
      userData.avatar,
      userData.phone,
      userData.address,
      userData.preferences,
      userData.createdAt,
      userData.updatedAt,
    );
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: Role
  }): Promise<UserEntity> {
    const userData: User = await this.prisma.user.create({ data });
    return this.toEntity(userData);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const userData: User | null = await this.prisma.user.findUnique({
      where: { email }
    });
    return userData ? this.toEntity(userData) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const userData: User | null = await this.prisma.user.findUnique({
      where: { id }
    });
    return userData ? this.toEntity(userData) : null;
  }

  async updateRefreshToken(userId: string, token: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }

  async findAll(): Promise<UserEntity[]> {
    const usersData: User[] = await this.prisma.user.findMany();
    return usersData.map(userData => this.toEntity(userData));
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async updateRole(userId: string, role: Role): Promise<UserEntity> {
    const userData: User = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    return this.toEntity(userData);
  }
}