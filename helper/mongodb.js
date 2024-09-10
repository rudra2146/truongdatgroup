const mongoose = require("mongoose");

exports.mongo_connection = async () => {
  mongoose.set("debug", true);
  try {
    console.log(process.env.DB_MONGO_URL);
   await  mongoose.connect(
      process.env.DB_MONGO_URL || 'mongodb://localhost:27017/boiler-plat')
      console.log("MongoDB Connected");
  } catch (e) {
    console.log("MongoDB Connection Error");
  }
};
