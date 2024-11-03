require('dotenv').config();
const Hapi = require('@hapi/hapi');
const home = require('./api/home')
const auth = require('./api/auth');
const users = require('./api/users');
const notifications = require('./api/notifications');
const UserService = require('./services/user-service');
const AuthService = require('./services/auth-service');
const NotificationService = require('./services/notification-service');
const AuthValidator = require('./validator/auth');
const UserValidator = require('./validator/users');
const jwtMiddleware = require('./middleware/jwt');
const validateRoute = require('./middleware/route-validator');
const ClientError = require('./exceptions/client-error');

const init = async () => {
  const userService = new UserService();
  const authService = new AuthService(userService);
  const notificationService = new NotificationService();

  const server = Hapi.server({
      port: process.env.PORT,
      host: process.env.HOST,
      routes: {
        cors: {
          origin: ['*'],
        },
      },
  });

  await server.register([
    {
      plugin: home,
    },
    {
      plugin: auth,
      options: {
        service: {
          "auth": authService,
          "user": userService
        },
        validator: AuthValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: {
          "user": userService
        },
        validator: UserValidator,
      },
    },
    {
      plugin: notifications,
      options: {
        service: {
          "notification": notificationService,
        },
      },
    }
  ]);

  server.ext('onPreHandler', jwtMiddleware);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      return h.response({
        error: true,
        message: response.message,
      }).code(response.statusCode).takeover();
    }

    return h.continue;
  });

  server.route({
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      if (!validateRoute(request.route.path)) {
        return h.redirect('/');
      }
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();