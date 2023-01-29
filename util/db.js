const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    // console.log(conn.db);
    console.log(`mongodb connection successful`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection;
