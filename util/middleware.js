const jwt = require('jsonwebtoken');

const { SECRET } = require('../util/config');
const { User, Session } = require('../models');

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

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: 'username or email already in use' });
  }

  next(error);
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7);

      const sessionUser = await Session.findOne({
        where: {
          token
        }
      });

      if (!sessionUser) {
        return res.status(401).json({ error: 'invalid session' });
      }

      const decodedToken = jwt.verify(token, SECRET);
      const userEnable = await User.findByPk(decodedToken.id);

      if (!userEnable || userEnable.disabled) {
        return res.status(401).json({ error: 'user disabled' });
      }

      req.decodedToken = decodedToken;
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = { errorHandler, tokenExtractor };
