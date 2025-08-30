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
});
