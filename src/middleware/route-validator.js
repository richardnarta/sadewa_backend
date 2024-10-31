const availableRoutes = [
  '/',
  '/auth/login',
  '/auth/forget',
  '/auth/verify',
  '/auth/logout'
];

const routePatterns = availableRoutes.map(route => {
  return route.replace(/\{userId\}/g, '[a-zA-Z0-9_-]{16}');
});

function validateRoute(incomingRoute) {
  return routePatterns.some(pattern => {
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(incomingRoute);
  });
}

module.exports = validateRoute;