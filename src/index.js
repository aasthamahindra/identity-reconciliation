require('dotenv').config();
const fastify = require('fastify')({ logger: true });

const start = async () => {
  try {
    fastify.listen({ port: process.env.PORT });
    fastify.log.info(`Server running on port ${process.env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
