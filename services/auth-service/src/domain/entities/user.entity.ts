import { Role } from '../../shared/types'; 

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: Role = Role.USER,
    public readonly isActive: boolean = true,
    public readonly refreshToken?: string | null,
    public readonly resetPasswordToken?: string | null,
    public readonly resetPasswordExpires?: Date | null,
    public readonly lastLoginAt?: Date | null,
    public readonly emailVerifiedAt?: Date | null,
    public readonly avatar?: string | null,
    public readonly phone?: string | null,
    public readonly address?: string | null,
    public readonly preferences?: any | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }): UserEntity {
    return new UserEntity(
      '', // ID será gerado pelo banco
      data.name,
      data.email,
      data.password,
      data.role || Role.USER,
      true,
    );
  }

  toPublic() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
      lastLoginAt: this.lastLoginAt,
      emailVerifiedAt: this.emailVerifiedAt,
      avatar: this.avatar,
      phone: this.phone,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
