const router = require('express').Router();

const { Blog } = require('../models');

router.get('/', async (_req, res) => {
  try {
    const blogs = await Blog.findAll();
    console.log(JSON.stringify(blogs, null, 2));
    return res.json(blogs);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    console.log(JSON.stringify(blog, null, 2));
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findByPk(id);

    if (blog) {
      await blog.destroy();
      console.log(JSON.stringify(blog, null, 2));
      return res.json({ message: 'Blog deleted successfully', blog });
    } else {
      return res.status(404).end();
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
