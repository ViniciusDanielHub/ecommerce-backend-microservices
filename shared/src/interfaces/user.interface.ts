import { Role } from '../enums';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile {
  id: string;
  userId: string;
  avatar?: string;
  phone?: string;
  address?: string;
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWithProfile extends IUser {
  profile?: IUserProfile;
}
