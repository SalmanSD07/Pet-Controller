const mongoose = require("mongoose");
db = mongoose.connect(
  "mongodb+srv://salman:salman@cluster0.9ypp5rj.mongodb.net/cupouchPets?retryWrites=true&w=majority",
  (err) => {
    console.log("Database connected");
    if (err) {
      console.log(err);
    }
  }
);
module.exports = { db };
