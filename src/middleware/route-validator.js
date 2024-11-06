const availableRoutes = [
  '/',
  '/auth/login',
  '/auth/forget',
  '/auth/verify',
  '/auth/logout',
  '/users',
  '/users/{userId}',
  '/users/{userId}/verify',
  '/users/password',
  '/notifications',
  '/notifications/{notificationId}',
  '/notifications/{notificationId}/read',
  'configuration/{sensorId}/start',
  'configuration/{sensorId}/stop',
  'configuration/{sensorId}',
  '/configuration/actuator',
  '/configuration/feeder/schedule',
  '/configuration/aerator/schedule',
];

const routePatterns = availableRoutes.map(route => {
  return route.replace(/\{userId\}/g, '[a-zA-Z0-9_-]{16}')
  .replace(/\{notificationId\}/g, '[1-9][0-9]*')
  .replace(/\{sensorId\}/g, '[a-zA-Z][0-9]*');
});

function validateRoute(incomingRoute) {
  return routePatterns.some(pattern => {
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(incomingRoute);
  });
}

module.exports = validateRoute;