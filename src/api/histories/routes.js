const routes = (handler) => [
  {
    method: 'GET',
    path: '/histories',
    handler: handler.getHistoryListHandler,
    options: {
      plugins: {
        auth: true,
        admin: false,
      }
    }
  },
];

module.exports = routes;