require('dotenv').config();
const Hapi = require('@hapi/hapi');
const home = require('./api/home')
const auth = require('./api/auth');
const users = require('./api/users');
const notifications = require('./api/notifications');
const configuration = require('./api/configuration');
const histories = require('./api/histories');
const UserService = require('./services/user-service');
const AuthService = require('./services/auth-service');
const NotificationService = require('./services/notification-service');
const ConfigurationService = require('./services/configuration-service');
const FirebaseService = require('./services/firebase-service');
const HistoryService = require('./services/history-service');
const AuthValidator = require('./validator/auth');
const UserValidator = require('./validator/users');
const ConfigurationValidator = require('./validator/configration');
const HistoryValidator = require('./validator/histories');
const jwtMiddleware = require('./middleware/jwt');
const validateRoute = require('./middleware/route-validator');
const ClientError = require('./exceptions/client-error');
const InternalServerError = require('./exceptions/internal-server-error');
const WebSocket = require('ws');
const { webSocketHandler, sensorListener } = require('./utils/websocket');
const { verifyToken } = require('./utils/jwt');

const webSocketClients = new Map();
const sensorData = {
  temperature: null,
  pH: null,
  salinity: null,
  turbidity: null,
}
const temporaryData = {
  temperature: [],
  pH: [],
  salinity: [],
  turbidity: [],
}

const init = async (test = false) => {
  const userService = new UserService();
  const authService = new AuthService(userService);
  const notificationService = new NotificationService();
  const firebaseService = new FirebaseService(notificationService);
  const configurationService = new ConfigurationService(firebaseService);
  const historyService = new HistoryService();

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
    },
    {
      plugin: histories,
      options: {
        service: {
          "history": historyService,
        },
        validator: HistoryValidator,
      },
    },
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

  if (!test) {
    sensorListener(temporaryData, sensorData, firebaseService);

    const wss = new WebSocket.Server({ noServer: true });
  
    server.listener.on('upgrade', async (request, socket, head) => {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const token = url.searchParams.get('token');
  
      const decodedToken = await verifyToken(token);
  
      if (decodedToken === null || decodedToken.type === undefined) {
        socket.destroy();
        return;
      }
  
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, decodedToken.id);
      });
    });
  
    wss.on('connection', (ws, userId) => {
      if (!webSocketClients.has(userId)) {
        webSocketClients.set(userId, {
          temperature: [],
          pH: [],
          salinity: [],
          turbidity: []
        });
      }
  
      webSocketHandler(ws, webSocketClients, userId, temporaryData, sensorData);
    });
  }
  

  if (!test) {
    await server.start();
  } else {
    await server.initialize();
  }

  console.log('Server running on %s', server.info.uri);

  return server;
};

if (require.main === module) {
  init();
}

module.exports = { init }