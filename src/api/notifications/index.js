const NotificationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'notifications',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const notificationHandler = new NotificationHandler(service, validator);
    server.route(routes(notificationHandler));
  },
};