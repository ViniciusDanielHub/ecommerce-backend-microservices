import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type PhoneChannel = 'sms' | 'whatsapp';

export interface SendOtpResult {
  success: boolean;
  channel: PhoneChannel;
  maskedPhone: string;
}

@Injectable()
export class PhoneService {
  private readonly logger = new Logger(PhoneService.name);
  private twilioClient: any;

  constructor(private readonly configService: ConfigService) {
    this.initTwilio();
  }

  private initTwilio() {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (!accountSid || !authToken) {
      this.logger.warn('⚠️  Twilio não configurado — usando modo DEV (código impresso no log)');
      return;
    }

    try {
      // Importação dinâmica para não quebrar se twilio não estiver instalado
      const twilio = require('twilio');
      this.twilioClient = twilio(accountSid, authToken);
      this.logger.log('✅ Twilio inicializado');
    } catch (err) {
      this.logger.error('❌ Erro ao inicializar Twilio:', err.message);
    }
  }

  // ──────────────────────────────────────────────
  // ENVIAR OTP
  // ──────────────────────────────────────────────

  async sendOtp(
    phone: string,
    code: string,
    channel: PhoneChannel,
  ): Promise<SendOtpResult> {
    const normalizedPhone = this.normalizePhone(phone);
    const message = this.buildMessage(code, channel);

    // Modo DEV — sem Twilio configurado
    if (!this.twilioClient) {
      this.logger.warn(`[DEV MODE] OTP para ${normalizedPhone} via ${channel}: ${code}`);
      return {
        success: true,
        channel,
        maskedPhone: this.maskPhone(normalizedPhone),
      };
    }

    try {
      if (channel === 'whatsapp') {
        await this.sendWhatsApp(normalizedPhone, message);
      } else {
        await this.sendSms(normalizedPhone, message);
      }

      this.logger.log(`✅ OTP enviado via ${channel} para ${this.maskPhone(normalizedPhone)}`);

      return {
        success: true,
        channel,
        maskedPhone: this.maskPhone(normalizedPhone),
      };
    } catch (error) {
      this.logger.error(`❌ Erro ao enviar OTP via ${channel}:`, error.message);

      // Fallback: se WhatsApp falhou, tenta SMS
      if (channel === 'whatsapp') {
        this.logger.warn('Tentando fallback para SMS...');
        return this.sendOtp(phone, code, 'sms');
      }

      throw new Error(`Falha ao enviar código de verificação: ${error.message}`);
    }
  }

  // ──────────────────────────────────────────────
  // MÉTODOS PRIVADOS
  // ──────────────────────────────────────────────

  private async sendSms(to: string, message: string): Promise<void> {
    const from = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    await this.twilioClient.messages.create({ body: message, from, to });
  }

  private async sendWhatsApp(to: string, message: string): Promise<void> {
    const whatsappFrom = this.configService.get<string>('TWILIO_WHATSAPP_NUMBER');
    // Twilio WhatsApp usa o prefixo 'whatsapp:'
    await this.twilioClient.messages.create({
      body: message,
      from: `whatsapp:${whatsappFrom}`,
      to: `whatsapp:${to}`,
    });
  }

  private buildMessage(code: string, channel: PhoneChannel): string {
    const appName = this.configService.get<string>('APP_NAME') || 'MarketPlace';

    if (channel === 'whatsapp') {
      return (
        `🛒 *${appName}*\n\n` +
        `Seu código de verificação é:\n\n` +
        `*${code}*\n\n` +
        `⏱ Válido por *10 minutos*.\n` +
        `Se não foi você, ignore esta mensagem.`
      );
    }

    return `${appName}: seu codigo de verificacao e ${code}. Valido por 10 minutos.`;
  }

  // ──────────────────────────────────────────────
  // UTILS
  // ──────────────────────────────────────────────

  /**
   * Normaliza número para formato E.164 (+5511999999999)
   * Assume Brasil se não houver DDI.
   */
  normalizePhone(phone: string): string {
    // Remove tudo que não for dígito ou '+'
    let cleaned = phone.replace(/[^\d+]/g, '');

    // Se não começa com '+', assume Brasil (+55)
    if (!cleaned.startsWith('+')) {
      // Remove possível '0' inicial (discagem nacional)
      cleaned = cleaned.replace(/^0/, '');
      cleaned = `+55${cleaned}`;
    }

    return cleaned;
  }

  /**
   * Mascara número: +5511999998888 → +55119****8888
   */
  maskPhone(phone: string): string {
    if (phone.length < 8) return '****';
    return phone.slice(0, 6) + '****' + phone.slice(-4);
  }
}