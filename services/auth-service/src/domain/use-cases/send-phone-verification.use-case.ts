import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TooManyRequestsException } from 'src/shared/exceptions/too-many-requests.exception';
import { IUserRepository } from '../../infrastructure/repositories/user.repository';
import { PhoneService, PhoneChannel } from '../../infrastructure/phone/phone.service';
import * as crypto from 'crypto';

@Injectable()
export class SendPhoneVerificationUseCase {
  // Cooldown: mínimo 60s entre reenvios
  private static readonly RESEND_COOLDOWN_MS = 60_000;
  // Expiração do código: 10 minutos
  private static readonly OTP_TTL_MS = 10 * 60 * 1000;

  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    private readonly phoneService: PhoneService,
  ) { }

  async execute(
    email: string,
    phone: string,
    channel: PhoneChannel,
  ): Promise<{ message: string; maskedPhone: string; channel: PhoneChannel }> {
    // 1. Localizar usuário pelo email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Mensagem genérica para não revelar se o email existe
      throw new NotFoundException(
        'Não foi possível encontrar uma conta com este email',
      );
    }

    // 2. Verificar se o email foi confirmado
    if (!user.emailVerifiedAt) {
      throw new BadRequestException(
        'Confirme seu email antes de verificar o telefone',
      );
    }

    // 3. Já verificou este número exato?
    const normalizedPhone = this.phoneService.normalizePhone(phone);
    if (user.phoneVerifiedAt && user.phone === normalizedPhone) {
      throw new BadRequestException('Este número já está verificado');
    }

    // 4. Throttle anti-spam
    if (user.phoneVerificationExpires) { //vamos supor 23:00 pedi expira 23:10
      const sentAt =
        user.phoneVerificationExpires.getTime() - //23:10:00 - 10 = 23:00:00 
        SendPhoneVerificationUseCase.OTP_TTL_MS; //OTP_TTL_MS = 10 * 60 * 1000 = 600.000ms 10 minutos
      const elapsed = Date.now() - sentAt; // 23:00:10 - 23:00:00 = 10 segundos

      if (elapsed < SendPhoneVerificationUseCase.RESEND_COOLDOWN_MS) { 
        const waitSec = Math.ceil(
          (SendPhoneVerificationUseCase.RESEND_COOLDOWN_MS - elapsed) / 1000,
        ); //60 - 10 falta 50 segundos para reenvio
        throw new TooManyRequestsException(
          `Aguarde ${waitSec}s antes de solicitar um novo código`,
        );
      }
    }

    //sentAt   = 23:00:00  (quando foi enviado)
    //agora = 23:00: 10(10 segundos depois)
    //elapsed = 23:00: 10 - 23:00:00 = 10 segundos = 10.000ms

    //o que faz o codigo acima 
    //60.000 - 10.000 = 50.000ms
    //50.000 / 1000   = 50 segundos
    //"Aguarde 50s antes de solicitar um novo código"

    // 5. Gerar OTP de 6 dígitos
    const code = this.generateOtp();
    const hashedCode = this.hashCode(code);
    const expiresAt = new Date(
      Date.now() + SendPhoneVerificationUseCase.OTP_TTL_MS,
    );

    // 6. Persistir no banco
    await this.userRepository.savePhoneVerification(
      user.id,
      normalizedPhone,
      hashedCode,
      expiresAt,
      channel,
    );

    // 7. Enviar via Twilio
    const result = await this.phoneService.sendOtp(phone, code, channel);

    return {
      message: `Código enviado via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}`,
      maskedPhone: result.maskedPhone,
      channel: result.channel,
    };
  }

  private generateOtp(): string {
    const num = crypto.randomInt(0, 1_000_000);
    return num.toString().padStart(6, '0');
  }

  private hashCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }
}