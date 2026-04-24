export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
