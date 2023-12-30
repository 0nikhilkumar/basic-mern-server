const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then((c) => console.log("Database connected"))
  .catch((error) => console.log("Database can't connect"));
