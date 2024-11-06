function sensorListener(temporaryData, data, firebaseService) {
  setInterval(() => {
    data.temperature = (Math.random() * (32 - 26) + 26).toFixed(2);
    data.pH = (Math.random() * (8.5 - 7.5) + 7.5).toFixed(2);
    data.turbidity = (Math.random() * (30 - 0) + 0).toFixed(2);
    data.salinity = (Math.random() * (30 - 10) + 10).toFixed(2);

    if (
      temporaryData.temperature.length == 20 ||
      temporaryData.pH.length == 20 ||
      temporaryData.salinity.length == 20 ||
      temporaryData.turbidity.length == 20
    ) {
      temporaryData.temperature.shift();
      temporaryData.pH.shift();
      temporaryData.salinity.shift();
      temporaryData.turbidity.shift();
    }

    temporaryData.temperature.push(Number(data.temperature));
    temporaryData.pH.push(Number(data.pH));
    temporaryData.salinity.push(Number(data.salinity));
    temporaryData.turbidity.push(Number(data.turbidity));
  }, 2000);

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