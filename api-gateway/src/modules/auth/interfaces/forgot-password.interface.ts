export interface ForgotPasswordResponse {
  message: string;
  token?: string;   // retornado apenas em development
  devNote?: string; // retornado apenas em development
}
