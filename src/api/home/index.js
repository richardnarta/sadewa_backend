const HomeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'home',
  version: '1.0.0',
  register: async (server) => {
    const homeHandler = new HomeHandler();
    server.route(routes(homeHandler));
  },
};