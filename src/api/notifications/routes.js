const routes = (handler) => [
  {
    method: 'GET',
    path: '/notifications',
    handler: handler.getUserNotificationHandler,
    options: {
      plugins: {
        auth: true,
        admin: false,
      }
    }
  },
  {
    method: 'GET',
    path: '/notifications/{notificationId}',
    handler: handler.getNotificationHandler,
    options: {
      plugins: {
        auth: true,
        admin: false,
      }
    }
  },
  {
    method: 'GET',
    path: '/notifications/{notificationId}/read',
    handler: handler.getNotificationAsReadHandler,
    options: {
      plugins: {
        auth: true,
        admin: false,
      }
    }
  },
];

module.exports = routes;