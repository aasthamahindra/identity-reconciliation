const identify = require('../controllers/identify.controllers');

module.exports = (fastify) => {
  fastify.post('/identify', identify);
};
