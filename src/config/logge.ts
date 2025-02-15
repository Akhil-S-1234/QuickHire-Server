// src/config.ts
export const Config = {
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    SERVICE_NAME: process.env.SERVICE_NAME || 'recruitment-service',
    NODE_ENV: process.env.NODE_ENV || 'development',
    // ... other config options
  };