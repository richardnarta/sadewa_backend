const routes = (handler) => [
  {
    method: 'GET',
    path: '/',
    handler: handler.getHomeHandler,
    options: {
      plugins: {
        auth: false,
        admin: false,
      }
    }
  }
];

module.exports = routes;