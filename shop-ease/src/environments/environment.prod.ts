export const environment = {
    production: false,
    apiUrl: 'https://api.shopease.com', // Reemplazar con tu URL de producción
    roles: {
      admin: 'admin',
      customer: 'customer',
      manager: 'manager'
    },
    tokenWhitelistedDomains: ['api.shopease.com'], // Dominios permitidos para CORS
    tokenBlacklistedRoutes: ['/auth/login', '/auth/register'],
    defaultPageSize: 10,
    enableDebug: false,
    version: '1.0.0',
    buildTimestamp: '2024-03-15T12:00:00.000Z' // Actualizar en cada build
  };