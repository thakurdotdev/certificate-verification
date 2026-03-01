const { ZodError } = require('zod');
const { error } = require('../utils/apiResponse');

const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.query) {
      req.query = schemas.query.parse(req.query);
    }
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }
    next();
  } catch (err) {
    if (err instanceof ZodError || err?.issues) {
      const issues = err.issues || err.errors || [];
      const messages = issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return error(res, messages, 400);
    }
    return error(res, err.message || 'Validation failed', 400);
  }
};

module.exports = validate;
