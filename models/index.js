const Blog = require('./blog');
const User = require('./user');
const ReadBlogs = require('./read_blogs');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadBlogs, as: 'readings' });
Blog.belongsToMany(User, { through: ReadBlogs, as: 'user_readers' });

module.exports = {
  Blog,
  User,
  ReadBlogs
};
