const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectDB = async () => {
  if (db) return db; // reuse existing connection

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db("week3db"); // default DB from URI
    console.log("MongoDB connected");
    return db;
  } catch (err) {
    console.error("DB Connection Error:", err);
    throw err;
  }
};

module.exports = connectDB;