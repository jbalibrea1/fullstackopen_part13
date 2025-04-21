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

module.exports = errorHandler;
