const HistoryHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'histories',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const historyHandler = new HistoryHandler(service, validator);
    server.route(routes(historyHandler));
  },
};