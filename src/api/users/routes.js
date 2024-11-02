const routes = (handler) => [
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUserListHandler,
    options: {
      plugins: {
        auth: true,
        admin: true,
      }
    }
  },
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
    options: {
      plugins: {
        auth: true,
        admin: true,
      }
    }
  },
  {
    method: 'GET',
    path: '/users/{userId}',
    handler: handler.getUserHandler,
    options: {
      plugins: {
        auth: true,
        admin: false,
      }
    }
  },
  {
    method: 'POST',
    path: '/users/{userId}/verify',
    handler: handler.postUserVerificationHandler,
    options: {
      plugins: {
        auth: true,
        admin: true,
      }
    }
  },
  {
    method: 'PATCH',
    path: '/users/password',
    handler: handler.patchUserPasswordHandler,
    options: {
      plugins: {
        auth: true,
        admin: false,
      }
    }
  },
  {
    method: 'DELETE',
    path: '/users/{userId}',
    handler: handler.deleteUserHandler,
    options: {
      plugins: {
        auth: true,
        admin: true,
      }
    }
  },
];

module.exports = routes;