const { identifyContact } = require('../services/contact.service');
const validateContactInput = require('../utils/validator')

module.exports = async function (req, reply) {
  try {
    const { email, phoneNumber } = req.body;
    if (!validateContactInput(email, phoneNumber)) {
      return reply.status(400).send({ error: 'At least one of email or phone number is required' });
    }

    const response = await identifyContact({ email, phoneNumber });
    return reply.code(200).send(response);
  } catch (err) {
    req.log.error(err);
    return reply.status(err.statusCode || 500).send(err.message);
  }
};
