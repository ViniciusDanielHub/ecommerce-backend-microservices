import { IsEmail, IsNotEmpty, MinLength, Matches, IsEnum, IsUUID, IsString } from 'class-validator';
import { Role } from '../enums';

export class LoginDto {
  @IsEmail({}, { message: 'Email deve ter formato válido' })
  email!: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password!: string;
}

export class RegisterDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  name!: string;

  @IsEmail({}, { message: 'Email deve ter formato válido' })
  email!: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @Matches(/(?=.*[a-z])/, { message: 'Senha deve conter pelo menos uma letra minúscula' })
  @Matches(/(?=.*[A-Z])/, { message: 'Senha deve conter pelo menos uma letra maiúscula' })
  @Matches(/(?=.*\d)/, { message: 'Senha deve conter pelo menos um número' })
  @Matches(/(?=.*[@$!%*?&])/, { message: 'Senha deve conter pelo menos um caractere especial' })
  password!: string;

  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  confirmPassword!: string;
}

export class PromoteUserDto {
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsUUID(4, { message: 'ID do usuário deve ser um UUID válido' })
  userId!: string;

  @IsEnum(Role, { message: 'Role deve ser uma opção válida' })
  newRole!: Role;
}
