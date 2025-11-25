export interface AuthConfig {
  port: number;
  serviceName: string;
  microservicePort: number;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  bcrypt: {
    saltRounds: number;
  };
  email: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
  };
  frontendUrl: string;
}

export const authConfig = (): AuthConfig => ({
  port: parseInt(process.env.SERVICE_PORT, 10) || 3001,
  serviceName: process.env.SERVICE_NAME || 'auth-service',
  microservicePort: parseInt(process.env.MICROSERVICE_PORT, 10) || 8001,
  database: {
    url: process.env.AUTH_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/auth_service',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRATION || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para outros
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || '"Seu App" <noreply@seuapp.com>',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
});
