const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

function connect() {
  mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
  );
  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
  });
};

module.exports = connect;
