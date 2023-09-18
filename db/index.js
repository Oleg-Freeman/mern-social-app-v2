const mongoose = require('mongoose');

function connect() {
    mongoose.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose.connection.once('open', () => {
        console.log('MongoDB database connection established successfully');
    });
}

module.exports = connect;
