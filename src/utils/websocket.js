const db = require('../../config/firebase-config');

function webSocketHandler(ws, webSocketClients, userId) {
  const subscriptions = webSocketClients.get(userId);

  ws.on('message', (message) => {
    const { action, sensorType } = JSON.parse(message);
    if (action === 'subscribe' && sensorType && !subscriptions.has(sensorType)) {
      subscriptions.add(sensorType);
    } else if (action === 'unsubscribe' && sensorType && subscriptions.has(sensorType)) {
      subscriptions.delete(sensorType);
    }
  });

  const sendData = (sensorType) => {
    const data = {
      temperature: Math.random() * (32 - 26) + 26,
      pH: Math.random() * (8.5 - 7.5) + 7.5,
      turbidity: Math.random() * (30 - 0) + 0,
      salinity: Math.random() * (30 - 10) + 10,
    };

    if (subscriptions.has(sensorType)) {
      ws.send(JSON.stringify({ sensorType, data: data[sensorType] }));
    }
  };

  setInterval(() => {
    subscriptions.forEach(sensorType => sendData(sensorType));
  }, 2000);

  ws.on('close', () => {
    webSocketClients.delete(userId);
  });
}

module.exports = webSocketHandler;