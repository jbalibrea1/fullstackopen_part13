const { Blog } = require('../models');
const { sequelize } = require('../util/db');

const router = require('express').Router();

router.get('/', async (_req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    order: [['likes', 'DESC']],
    group: ['author']
  });
  res.json(authors);
});

module.exports = router;
