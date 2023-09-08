const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDb = require('./db');

// .env config
require('dotenv').config();

// Port number configuration
const port = process.env.PORT || 5000;

// Connect DB
connectDb();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/users', require('./routes/user.routes'));
app.use('/posts', require('./routes/post.routes'));
app.use('/comments', require('./routes/comment.routes'));
app.use('/likes', require('./routes/like.routes'));

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
    const { method, originalUrl } = req;

    console.error(`Error ${status} ${method} ${originalUrl} - `, error.message);

    if (error) {
        res.status(status).json({ message, method, path: originalUrl });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
