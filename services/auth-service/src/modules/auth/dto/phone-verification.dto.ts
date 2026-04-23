import { IsString, IsNotEmpty, IsIn, IsEmail, Matches } from 'class-validator';

export class SendPhoneVerificationDto {
  /** Email do usuário — usado para localizar a conta (endpoint público) */
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  /**
   * Número de telefone.
   * Aceita formatos brasileiros: (11)99999-8888, 11999998888, +5511999998888
   */
  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(
    /^(\+?\d{1,3}[-.\s]?)?(\(?\d{2,3}\)?[-.\s]?)?\d{4,5}[-.\s]?\d{4}$/,
    { message: 'Formato de telefone inválido' },
  )
  phone: string;

  /** Canal de envio: 'sms' ou 'whatsapp' */
  @IsString()
  @IsIn(['sms', 'whatsapp'], { message: 'Canal deve ser "sms" ou "whatsapp"' })
  channel: 'sms' | 'whatsapp';
}

export class VerifyPhoneDto {
  /** Email do usuário — necessário pois o endpoint é público (sem JWT) */
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  /** Código OTP de 6 dígitos recebido por SMS ou WhatsApp */
  @IsString()
  @IsNotEmpty({ message: 'Código é obrigatório' })
  @Matches(/^\d{6}$/, { message: 'Código deve ter exatamente 6 dígitos' })
  code: string;
}