export const appConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3003,
  serviceName: process.env.SERVICE_NAME || 'product-service',
  categoryServiceUrl: process.env.CATEGORY_SERVICE_URL || 'http://localhost:3004',
  fileServiceUrl: process.env.FILE_SERVICE_URL || 'http://localhost:3006',
});
