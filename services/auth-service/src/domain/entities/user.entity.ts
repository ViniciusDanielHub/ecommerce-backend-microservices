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
    public readonly phoneVerifiedAt?: Date | null,
    public readonly phoneVerificationCode?: string | null,
    public readonly phoneVerificationExpires?: Date | null,
    public readonly phoneVerificationChannel?: string | null,
  ) { }

  static create(data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }): UserEntity {
    return new UserEntity(
      '', //id gerado pelo banco
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
      phoneVerifiedAt: this.phoneVerifiedAt,
      phone: this.phone ? this.maskPhone(this.phone) : null,
      avatar: this.avatar,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /** Indica se a conta está 100% verificada (email + telefone) */
  get isFullyVerified(): boolean {
    return !!this.emailVerifiedAt && !!this.phoneVerifiedAt;
  }

  /** Indica qual etapa de verificação está pendente */
  get pendingVerification(): 'email' | 'phone' | null {
    if (!this.emailVerifiedAt) return 'email';
    if (!this.phoneVerifiedAt) return 'phone';
    return null;
  }

  private maskPhone(phone: string): string {
    if (phone.length < 8) return '****';
    return phone.slice(0, 4) + '****' + phone.slice(-4);
  }
}