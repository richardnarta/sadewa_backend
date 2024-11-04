const db = require('../../config/firebase-config');

function webSocketHandler(ws, webSocketClients, userId) {
  const subscriptions = webSocketClients.get(userId);
  const temporaryData = {
    temperature: [],
    pH: [],
    salinity: [],
    turbidity: []
  }

  ws.on('message', (message) => {
    const { action, sensorType } = JSON.parse(message);
    if (action === 'subscribe' && sensorType && !subscriptions.has(sensorType)) {
      subscriptions.add(sensorType);
      subscriptions.add('first');

    } else if (action === 'unsubscribe' && sensorType && subscriptions.has(sensorType)) {
      subscriptions.delete(sensorType);
    }
  });

  const sendData = (sensorType, data) => {
    if (subscriptions.has(sensorType)) {
      ws.send(JSON.stringify({ sensorType, data: data[sensorType] }));
    }
  };

  setInterval(() => {
    if (subscriptions.has('first')) {
      subscriptions.delete('first');

      let lastElement;
      for (const item of subscriptions) {
        lastElement = item;
      }
      console.log(temporaryData[lastElement])
      ws.send(JSON.stringify({ 
        sensorType: lastElement, 
        arrayData: temporaryData[lastElement].join(',')
      }));
    } else {
      const data = {
        temperature: (Math.random() * (32 - 26) + 26).toFixed(2),
        pH: (Math.random() * (8.5 - 7.5) + 7.5).toFixed(2),
        turbidity: (Math.random() * (30 - 0) + 0).toFixed(2),
        salinity: (Math.random() * (30 - 10) + 10).toFixed(2),
      };
  
      if (
        temporaryData.temperature.length == 10 ||
        temporaryData.pH.length == 10 ||
        temporaryData.salinity.length == 10 ||
        temporaryData.turbidity.length == 10
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
  
      subscriptions.forEach(sensorType => sendData(sensorType, data));
    }
  }, 2000);

  ws.on('close', () => {
    webSocketClients.delete(userId);
  });
}

module.exports = webSocketHandler;