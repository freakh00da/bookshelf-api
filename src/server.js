const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  console.log('starting server...');
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`server started at ${server.info.uri}`);
};

init();
