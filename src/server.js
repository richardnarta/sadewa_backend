require('dotenv').config();

const Hapi = require('@hapi/hapi');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return {"name": "Tambak Udang Sadewa Farm"};
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();