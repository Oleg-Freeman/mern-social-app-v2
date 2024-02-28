const mongoose = require('mongoose');

function connect(mongoUrl) {
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose.connection.once('open', () => {
        console.log('MongoDB database connection established successfully');
    });
}

module.exports = connect;
