const express = require('express');
require("dotenv").config();
const app = express();
const http = require("http") ;
require("./config/db").connect();
require('express-async-errors'); // replaces try-catch blocks in route handlers




app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ** Express Routes: Start ****************************************************
const categories = require('./routes/categories');
const users = require('./routes/users');
const login = require('./routes/login');
const quizzes = require('./routes/quizzes');
const user_quizzes = require('./routes/user_quizzes');
const user_answers = require('./routes/user_answers');
const questions = require('./routes/questions');


app.use('/api/categories', categories);
app.use('/api/users', users);
app.use('/api/login', login);
app.use('/api/quizzes', quizzes);
  app.use('/api/quizzes', questions); // questions is nested
app.use('/api/user-quizzes', user_quizzes);
  app.use('/api/user-quizzes', user_answers); // user-answers is nested

// ** Express Routes: End ******************************************************


// ** Server Setup: Start ******************************************************
const server = http.createServer(app);

  const port = process.env.PORT;
  server.listen(port, ()=>console.log(`Listening on port ${port}...`));
module.exports = app; // Export for use in tests
// ** Server Setup: End ********************************************************
