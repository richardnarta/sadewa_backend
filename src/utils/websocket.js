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
      temperature: Math.random() * 100,
      pH: Math.random() * 14,
      turbidity: Math.random() * 10,
      salinity: Math.random() * 35,
    };

    if (subscriptions.has(sensorType)) {
      ws.send(JSON.stringify({ sensorType, data: data[sensorType] }));
    }
  };

  setInterval(() => {
    sendData('temperature');
    sendData('pH');
    sendData('turbidity');
    sendData('salinity');
  }, 3000);

  ws.on('close', () => {
    webSocketClients.delete(userId);
  });
}

module.exports = webSocketHandler;