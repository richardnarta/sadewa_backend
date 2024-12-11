const { db } = require('../../config/firebase-config');

function sensorListener(temporaryData, data, firebaseService) {
  const ph = db.ref('sensorData/pH');

  ph.on('value', (snapshot) => {
    const pHValue = snapshot.val();

    data.pH = pHValue.toFixed(2)

    if (temporaryData.pH.length == 20) {
      temporaryData.pH.shift();
    }

    temporaryData.pH.push(Number(pHValue));
  });

  const salinity = db.ref('sensorData/salinity');

  salinity.on('value', (snapshot) => {
    const salinityValue = snapshot.val();

    data.salinity = salinityValue.toFixed(2)

    if (temporaryData.salinity.length == 20) {
      temporaryData.salinity.shift();
    }

    temporaryData.salinity.push(Number(salinityValue));
  });

  const temperature = db.ref('sensorData/temperature');

  temperature.on('value', (snapshot) => {
    const temperatureValue = snapshot.val();

    data.temperature = temperatureValue.toFixed(2)

    if (temporaryData.temperature.length == 20) {
      temporaryData.temperature.shift();
    }

    temporaryData.temperature.push(Number(temperatureValue));
  });

  const turbidity = db.ref('sensorData/turbidity');

  turbidity.on('value', (snapshot) => {
    const turbidityValue = snapshot.val();

    data.turbidity = turbidityValue.toFixed(2)

    if (temporaryData.turbidity.length == 20) {
      temporaryData.turbidity.shift();
    }

    temporaryData.turbidity.push(Number(turbidityValue));
  });

  firebaseService.listenToFeederStatus();
  firebaseService.listenToSensorConfiguration();
  firebaseService.listenToSensorStatus();
  firebaseService.listenToFeederSchedule();
  firebaseService.listenToAeratorSchedule();
}

function webSocketHandler(ws, webSocketClients, userId, temporaryData, data) {
  const subscriptions = webSocketClients.get(userId);

  ws.on('message', (message) => {
    const { action, sensorType } = JSON.parse(message);
    if (action === 'subscribe' && sensorType && subscriptions[sensorType].length == 0) {
      subscriptions[sensorType].push(sensorType);
      subscriptions[sensorType].push('first');

      ws.send(JSON.stringify({ 
        sensorType, 
        arrayData: temporaryData[sensorType].join(',')
      }));

      subscriptions[sensorType].pop();
    } else if (action === 'unsubscribe' &&
      sensorType &&
      subscriptions[sensorType].includes(sensorType)
    ) {
      subscriptions[sensorType].length = 0;
    }
  });

  const sendData = (sensorType, data) => {
    if (subscriptions[sensorType].includes(sensorType)) {
      ws.send(JSON.stringify({ sensorType, data: data[sensorType] }));
    }
  };

  setInterval(() => {
    for (const sensorType in subscriptions) {
      if (!subscriptions[sensorType].includes('first')) {
        sendData(sensorType, data)
      }
    }
  }, 2000);

  ws.on('close', () => {
    webSocketClients.delete(userId);
  });
}

module.exports = {
  webSocketHandler,
  sensorListener,
};