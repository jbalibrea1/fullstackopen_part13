const router = require('express').Router();

const { ReadBlogs } = require('../models');

const { tokenExtractor } = require('../util/middleware');
router.post('/', async (req, res) => {
  const { blogId, userId } = req.body;

  const entry = await ReadBlogs.create({
    blogId,
    userId,
    read: false
  });

  res.json(entry);
});

router.put('/:id', tokenExtractor, async (req, res) => {
  const { id } = req.params;
  const userId = req.decodedToken.id;
  const entry = await ReadBlogs.findByPk(id);

  if (!entry) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  if (entry.userId !== userId) {
    return res
      .status(403)
      .json({ error: 'You can only modify your own reading list' });
  }

  entry.read = true;

  await entry.save();

  return res.json(entry);
});

module.exports = router;
