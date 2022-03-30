const mongoose = require("mongoose");

const {MONGO_URI}  = process.env;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect("mongodb+srv://abdelghani:admin@cluster0.d0kyf.mongodb.net/dbquiz2")
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
        console.log(MONGO_URI);
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};