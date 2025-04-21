const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

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
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1991,
        max: new Date().getFullYear()
      },
      defaultValue: new Date().getFullYear()
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'blog'
  }
);

module.exports = Blog;
