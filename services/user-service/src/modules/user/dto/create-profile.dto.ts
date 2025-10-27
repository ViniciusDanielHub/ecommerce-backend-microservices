import { IsOptional, IsString, IsEnum } from 'class-validator';

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
}

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
