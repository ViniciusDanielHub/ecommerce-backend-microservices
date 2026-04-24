export interface ValidateTokenResponse {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
