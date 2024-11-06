const routes = (handler) => [
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
  {
    method: 'GET',
    path: '/configuration/actuator',
    handler: handler.getActuatorConfigurationHandler,
    options: {
      plugins: {
        auth: true,
        admin: false,
      }
    }
  },
  {
    method: 'PUT',
    path: '/configuration/feeder/schedule',
    handler: handler.putFeederScheduleHandler,
    options: {
      plugins: {
        auth: true,
        admin: true,
      }
    }
  },
  {
    method: 'PUT',
    path: '/configuration/aerator/schedule',
    handler: handler.putAeratorScheduleHandler,
    options: {
      plugins: {
        auth: true,
        admin: true,
      }
    }
  },
];

module.exports = routes;