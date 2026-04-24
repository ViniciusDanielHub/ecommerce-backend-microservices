export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerifiedAt: string | null;
    phoneVerifiedAt: string | null;
  };
  account_status: {
    email_verified: boolean;
    phone_verified: boolean;
    warning: string | null;
  };
}