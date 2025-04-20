require('dotenv').config();
const { Sequelize, Model, DataTypes } = require('sequelize');

const express = require('express');
const app = express();
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
  }
);

Blog.sync();

app.get('/api/blogs', async (_req, res) => {
  try {
    const blogs = await Blog.findAll();
    console.log(JSON.stringify(blogs, null, 2));
    return res.json(blogs);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    console.log(JSON.stringify(blog, null, 2));
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
