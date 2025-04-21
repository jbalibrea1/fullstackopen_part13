const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { Blog, User } = require('../models');

const { SECRET } = require('../util/config');
const { Op } = require('sequelize');

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

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get('/', async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } }
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  });
  console.log(JSON.stringify(blogs, null, 2));
  return res.json(blogs);
});

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({
    ...req.body,
    userId: user.id
  });
  console.log(JSON.stringify(blog, null, 2));
  return res.json(blog);
});

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (!req.blog) {
    return res.status(404).end();
  }

  if (req.blog.userId !== req.decodedToken.id) {
    return res
      .status(403)
      .json({ error: 'only the creator can delete this blog' });
  }

  await req.blog.destroy();
  console.log(JSON.stringify(req.blog, null, 2));
  return res.json({ message: 'Blog deleted successfully', blog: req.blog });
});

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    const { likes } = req.body;
    req.blog.likes = likes;
    await req.blog.save();
    return res.json(req.blog);
  } else {
    return res.status(404).end();
  }
});

module.exports = router;
