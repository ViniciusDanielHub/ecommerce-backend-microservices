export interface GatewayConfig {
  port: number;
  serviceName: string;
  services: {
    auth: {
      url: string;
      port: number;
    };
    user: {
      url: string;
      port: number;
    };
    product: {
      url: string;
      port: number;
    };
    category: {
      url: string;
      port: number;
    };
    file: {
      url: string;
      port: number;
    };
    admin: {
      url: string;
      port: number;
    };
  };
  jwt: {
    secret: string;
  };
}

export const gatewayConfig = (): GatewayConfig => ({
  port: parseInt(process.env.GATEWAY_PORT, 10) || 3000,
  serviceName: process.env.SERVICE_NAME || 'api-gateway',
  services: {
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
      port: parseInt(process.env.AUTH_SERVICE_PORT, 10) || 3001,
    },
    user: {
      url: process.env.USER_SERVICE_URL || 'http://user-service:3002',
      port: parseInt(process.env.USER_SERVICE_PORT, 10) || 3002,
    },
    product: {
      url: process.env.PRODUCT_SERVICE_URL || 'http://product-service:3005',
      port: parseInt(process.env.PRODUCT_SERVICE_PORT, 10) || 3005,
    },
    category: {
      url: process.env.CATEGORY_SERVICE_URL || 'http://category-service:3004',
      port: parseInt(process.env.CATEGORY_SERVICE_PORT, 10) || 3004,
    },
    file: {
      url: process.env.FILE_SERVICE_URL || 'http://file-service:3006',
      port: parseInt(process.env.FILE_SERVICE_PORT, 10) || 3006,
    },
    admin: {
      url: process.env.ADMIN_SERVICE_URL || 'http://admin-service:3003',
      port: parseInt(process.env.ADMIN_SERVICE_PORT, 10) || 3003,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-gateway-secret',
  },
});
