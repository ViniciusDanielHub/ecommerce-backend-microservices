import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEmailService, SendEmailOptions } from './email.interface';
import { getEmailLayout } from './templates/email-layout.template';
import {
  getResetPasswordTemplate,
  getResetPasswordTextTemplate,
} from './templates/reset-password.template';
import {
  getWelcomeTemplate,
  getWelcomeTextTemplate,
} from './templates/welcome.template';
import {
  getPasswordChangedTemplate,
  getPasswordChangedTextTemplate,
} from './templates/password-changed.template';

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    // URL do frontend (manual ou padrão)
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'http://localhost:3000';

    this.createTransporter();
  }

  private createTransporter() {
    const emailPort = parseInt(this.configService.get<string>('EMAIL_PORT') || '2525', 10);
    const emailSecure = this.configService.get<string>('EMAIL_SECURE') === 'true';

    console.log('🔧 EMAIL CONFIG:', {
      host: this.configService.get<string>('EMAIL_HOST'),
      port: emailPort,
      secure: emailSecure,
      user: this.configService.get<string>('EMAIL_USER'),
    });

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: emailPort,
      secure: emailSecure, 
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });

    // Verificar conexão
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('Erro ao conectar email:', error.message);
      } else {
        this.logger.log('✅ Email pronto para envio');
      }
    });
  }

  private async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      this.logger.log(`Email enviado: ${options.to}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email: ${error.message}`);
      throw new Error('Falha ao enviar email');
    }
  }

  async sendResetPasswordEmail(email: string, resetToken: string): Promise<void> {
    const resetLink = `${this.frontendUrl}/reset-password?token=${resetToken}`;

    await this.sendEmail({
      to: email,
      subject: 'Recuperação de Senha',
      html: getEmailLayout(
        getResetPasswordTemplate(resetLink, '1 hora'),
        '#4CAF50',
        'Recuperação de Senha'
      ),
      text: getResetPasswordTextTemplate(resetLink, '1 hora'),
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Bem-vindo!',
      html: getEmailLayout(
        getWelcomeTemplate(name),
        '#2196F3',
        'Bem-vindo'
      ),
      text: getWelcomeTextTemplate(name),
    });
  }

  async sendPasswordChangedEmail(email: string, name: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Senha Alterada',
      html: getEmailLayout(
        getPasswordChangedTemplate(name),
        '#FF9800',
        'Senha Alterada'
      ),
      text: getPasswordChangedTextTemplate(name),
    });
  }
}