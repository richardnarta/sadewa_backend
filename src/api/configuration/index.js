const ConfigurationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'configuration',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const configurationHandler = new ConfigurationHandler(service, validator);
    server.route(routes(configurationHandler));
  },
};