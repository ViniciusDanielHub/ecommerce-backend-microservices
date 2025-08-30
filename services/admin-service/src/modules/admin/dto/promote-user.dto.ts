import { IsString, IsEnum, IsUUID } from 'class-validator';

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
}

export class PromoteUserDto {
  @IsUUID()
  userId: string;

  @IsEnum(Role)
  newRole: Role;
}
