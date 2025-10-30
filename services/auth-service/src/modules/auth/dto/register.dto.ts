import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';
import { Match } from '../validators/match-password.validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  @Match('password', { message: 'As senhas não coincidem' }) 
  confirmPassword: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
