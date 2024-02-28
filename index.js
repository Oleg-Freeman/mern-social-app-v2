const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDb = require('./db');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');

// Port number configuration
const port = config.getPort();

// Connect DB
connectDb(config.getMongoUri());

// Swagger configuration
const swaggerDocs = swaggerJsDoc(config.getSwaggerJSDocConfig());

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/users', require('./routes/user.routes'));
app.use('/posts', require('./routes/post.routes'));
app.use('/comments', require('./routes/comment.routes'));
app.use('/likes', require('./routes/like.routes'));
app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, { explorer: true })
);

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
