const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config();

const ContactServer = require('./api/server');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const runServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, options);
    console.log('Database connection successful');
    new ContactServer().start();
  } catch (e) {
    process.exit(1);
  }
};

runServer();
