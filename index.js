const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const auhorsRouter = require('./controllers/authors');
const readinglistsRouter = require('./controllers/readinglists');
const logoutRouter = require('./controllers/logout');
const { errorHandler } = require('./util/middleware');

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', auhorsRouter);
app.use('/api/readinglists', readinglistsRouter);
app.use('/api/logout', logoutRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
