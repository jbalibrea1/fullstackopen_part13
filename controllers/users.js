const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User, Blog } = require('../models');

function pwHash(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

router.get('/', async (_req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  const { username, name, password } = req.body;
  const passwordHash = await pwHash(password);
  const user = await User.create({
    username,
    name,
    passwordHash
  });
  res.status(201).json(user);
});

router.put('/:username', async (req, res) => {
  const { username } = req.params;
  const { name, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (name) user.name = name;
  if (password) user.passwordHash = await pwHash(password);

  await user.save();

  const userData = user.toJSON();
  delete userData.passwordHash;

  res.json(userData);
});

module.exports = router;
