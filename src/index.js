require('dotenv').config();
const fastify = require('fastify')({ logger: true });

fastify.register(require('./routes/identify.routes'));

const start = async () => {
  try {
    fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0'});
    fastify.log.info(`Server running on port ${process.env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
