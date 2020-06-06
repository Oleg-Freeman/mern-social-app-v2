const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDb = require('./db');
const path = require('path');
const config = require('config');

// Port number configuretion
const port = config.get('PORT') || 5000;

// Connect DB
connectDb();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));
app.use('/likes', require('./routes/likes'));

app.use((req, res, next) => {
  res.json('Page not found');
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json('Internal server error');
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html')); // relative path
  });
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
