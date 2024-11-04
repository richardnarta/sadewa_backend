require('dotenv').config();
const Hapi = require('@hapi/hapi');
const home = require('./api/home')
const auth = require('./api/auth');
const users = require('./api/users');
const notifications = require('./api/notifications');
const configuration = require('./api/configuration');
const UserService = require('./services/user-service');
const AuthService = require('./services/auth-service');
const NotificationService = require('./services/notification-service');
const ConfigurationService = require('./services/configuration-service');
const FirebaseService = require('./services/firebase-service');
const AuthValidator = require('./validator/auth');
const UserValidator = require('./validator/users');
const ConfigurationValidator = require('./validator/configration');
const jwtMiddleware = require('./middleware/jwt');
const validateRoute = require('./middleware/route-validator');
const ClientError = require('./exceptions/client-error');
const InternalServerError = require('./exceptions/internal-server-error');
const WebSocket = require('ws');
const webSocketHandler = require('./utils/websocket');
const { verifyToken } = require('./utils/jwt');

const webSocketClients = new Map();

const init = async () => {
  const userService = new UserService();
  const authService = new AuthService(userService);
  const notificationService = new NotificationService();
  const firebaseService = new FirebaseService();
  const configurationService = new ConfigurationService(firebaseService);

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
    },
    {
      plugin: configuration,
      options: {
        service: {
          "configuration": configurationService,
        },
        validator: ConfigurationValidator,
      },
    }
  ]);

  server.ext('onPreHandler', jwtMiddleware);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (
      response instanceof ClientError ||
      response instanceof InternalServerError
    ) {
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

  const wss = new WebSocket.Server({ noServer: true });

  server.listener.on('upgrade', async (request, socket, head) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const token = url.searchParams.get('token');

    const decodedToken = await verifyToken(token);

    if (decodedToken === null) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, decodedToken.id);
    });
  });

  wss.on('connection', (ws, userId) => {
    if (!webSocketClients.has(userId)) {
      webSocketClients.set(userId, new Set());
    }

    webSocketHandler(ws, webSocketClients, userId);
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();