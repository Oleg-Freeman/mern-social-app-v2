const mongoose = require('mongoose');

function connect(mongoUrl) {
    mongoose.connect(mongoUrl);
    mongoose.connection.once('open', () => {
        console.log('MongoDB database connection established successfully');
    });
}

module.exports = connect;
