const jwt = require('jsonwebtoken');
const router = require('express').Router();

const { Session } = require('../models');
const { tokenExtractor } = require('../util/middleware');

router.delete('/', tokenExtractor, async (req, res) => {
  console.log('Logging out');

  const authorization = req.get('authorization');
  const token = authorization.substring(7);

  const deletedSession = await Session.destroy({
    where: {
      token
    }
  });

  if (deletedSession === 0) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
