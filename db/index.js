const mongoose = require('mongoose');
const config = require('config');

function connect() {
  mongoose.connect(config.get('ATLAS_URI'), {
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
