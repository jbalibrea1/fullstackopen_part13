const jwt = require('jsonwebtoken');

const { SECRET } = require('../util/config');

const errorHandler = (error, _req, res, next) => {
  console.error(error.message);
  console.error('ERROR NAME --->', error.name);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.errors.map((e) => e.message) });
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(500).json({ error: 'database error' });
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(404).json({ error: 'blog not found' });
  }
  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
      console.log('req.decodedToken', req.decodedToken);
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = { errorHandler, tokenExtractor };
