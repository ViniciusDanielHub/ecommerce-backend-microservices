export interface SendPhoneVerificationResponse {
  message: string;
  maskedPhone: string;
  channel: 'sms' | 'whatsapp';
}

export interface VerifyPhoneResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phoneVerifiedAt: string;
  };
}
