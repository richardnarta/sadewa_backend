const AuthHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'auth',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const authHandler = new AuthHandler(service, validator);
    server.route(routes(authHandler));
  },
};