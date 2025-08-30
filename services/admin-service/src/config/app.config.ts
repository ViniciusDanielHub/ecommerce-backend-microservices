export interface AdminConfig {
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
    userService: string;
  };
}

export const adminConfig = (): AdminConfig => ({
  port: parseInt(process.env.SERVICE_PORT, 10) || 3003,
  serviceName: process.env.SERVICE_NAME || 'admin-service',
  microservicePort: parseInt(process.env.MICROSERVICE_PORT, 10) || 8003,
  database: {
    url: process.env.ADMIN_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/admin_service',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
  },
  services: {
    authService: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
    userService: process.env.USER_SERVICE_URL || 'http://user-service:3002',
  },
});
