const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class ReadBlogs extends Model {}

ReadBlogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' }
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'read_blogs'
  }
);

module.exports = ReadBlogs;
