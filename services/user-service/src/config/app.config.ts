export interface UserConfig {
  port: number;
  serviceName: string;
  microservicePort: number;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
  };
  services: {
    authService: string;
  };
  internalServiceToken: string;
}

export const userConfig = (): UserConfig => ({
  port: parseInt(process.env.SERVICE_PORT, 10) || 3002,
  serviceName: process.env.SERVICE_NAME || 'user-service',
  microservicePort: parseInt(process.env.MICROSERVICE_PORT, 10) || 8002,
  database: {
    url: process.env.USER_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/user_service',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
  },
  services: {
    authService: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
  },
  internalServiceToken: process.env.INTERNAL_SERVICE_TOKEN || 'internal-service-call',
});
