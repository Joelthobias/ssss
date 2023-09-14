const { MongoClient } = require('mongodb');

const state = {
	db: null,
};

// const url = 'mongodb://localhost:27017';
const url = 'mongodb+srv://joel:123@cluster0.chsu5.mongodb.net/week3'
const dbname = 'week3';

const connect = async () => {
  try {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    state.db = client.db(dbname);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

module.exports = {
  connect,
  get: () => state.db,
};
