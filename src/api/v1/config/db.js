const mongoose = require("mongoose");
db = mongoose.connect(
  "mongodb+srv://root:root@cluster0.3oqd1.mongodb.net/cupouchPets?retryWrites=true&w=majority",
  (err) => {
    console.log("Database connected");
    if (err) {
      console.log(err);
    }
  }
);
module.exports = { db };