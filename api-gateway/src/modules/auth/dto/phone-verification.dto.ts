import { IsEmail, IsString, IsIn, Matches } from 'class-validator';

export class SendPhoneVerificationDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsIn(['sms', 'whatsapp'])
  channel: 'sms' | 'whatsapp';
}

export class VerifyPhoneDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\d{6}$/)
  code: string;
}