const mongoose = require('mongoose');

function connect() {
    mongoose.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    mongoose.connection.once('open', () => {
        console.log('MongoDB database connection established successfully');
    });
}

module.exports = connect;
