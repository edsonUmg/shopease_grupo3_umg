export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  roles: {
    admin: 'admin',
    customer: 'customer',
    manager: 'manager'
  },
  tokenWhitelistedDomains: ['localhost:3000'],
  tokenBlacklistedRoutes: ['/auth/login', '/auth/register']
};