export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface IEmailService {
  sendResetPasswordEmail(email: string, resetToken: string): Promise<void>;
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendPasswordChangedEmail(email: string, name: string): Promise<void>;
}