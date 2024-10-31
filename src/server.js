require('dotenv').config();
const Hapi = require('@hapi/hapi');
const home = require('./api/home')
const auth = require('./api/auth');
const UserService = require('./services/user-service')
const AuthService = require('./services/auth-service')
const AuthValidator = require('./validator/auth')
const jwtMiddleware = require('./middleware/jwt');
const validateRoute = require('./middleware/route-validator')
const ClientError = require('./exceptions/client-error');

const init = async () => {
  const authService = new AuthService();
  const userService = new UserService();

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
    }
  ]);

  server.ext('onPreHandler', jwtMiddleware);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      return h.response({
        error: false,
        message: response.message,
      }).code(response.statusCode);
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