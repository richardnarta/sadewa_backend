const routes = (handler) => [
  {
    method: 'GET',
    path: '/configuration/sensor',
    handler: handler.getSensorConfigurationHandler,
    options: {
      plugins: {
        auth: true,
        admin: false,
      }
    }
  },
  {
    method: 'GET',
    path: '/configuration/{sensorId}',
    handler: handler.getSensorConfigurationByIdHandler,
    options: {
      plugins: {
        auth: true,
        admin: false,
      }
    }
  },
  {
    method: 'GET',
    path: '/configuration/{sensorId}/start',
    handler: handler.getSensorStartHandler,
    options: {
      plugins: {
        auth: true,
        admin: true,
      }
    }
  },
  {
    method: 'GET',
    path: '/configuration/{sensorId}/stop',
    handler: handler.getSensorStopHandler,
    options: {
      plugins: {
        auth: true,
        admin: true,
      }
    }
  },
  {
    method: 'PUT',
    path: '/configuration/{sensorId}',
    handler: handler.putSensorConfigurationHandler,
    options: {
      plugins: {
        auth: true,
        admin: true,
      }
    }
  },
];

module.exports = routes;