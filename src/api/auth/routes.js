const routes = (handler) => [
  {
    method: 'POST',
    path: '/auth/login',
    handler: handler.postAuthLoginHandler,
    options: {
      plugins: {
        auth: false,
        admin: false,
      }
    }
  },
  {
    method: 'POST',
    path: '/auth/forget',
    handler: handler.postAuthForgetHandler,
    options: {
      plugins: {
        auth: false,
        admin: false,
      }
    }
  },
  {
    method: 'POST',
    path: '/auth/verify',
    handler: handler.postAuthVerifyForgetHandler,
    options: {
      plugins: {
        auth: false,
        admin: false,
      }
    }
  },
  {
    method: 'GET',
    path: '/auth/logout',
    handler: handler.getAuthLogoutHandler,
    options: {
      plugins: {
        auth: true,
        admin: false,
      }
    }
  }
];

module.exports = routes;