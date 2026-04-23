import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'userId é obrigatório' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'refreshToken é obrigatório' })
  refreshToken: string;
}
