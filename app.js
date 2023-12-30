const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors")
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

dotenv.config({ path: "./config.env" });
require("./db/mongoConn.js");

app.use(express.json());
npm.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
app.use(require("./router/auth.js"));

const PORT = process.env.PORT;

// app.get("/about", (req, res) => {
//   res.send("About Page");
// });

// app.get("/contact", (req, res) => {
//   res.cookie("jwtoken", "iam");
//   res.send("Contact Page");
// });
// app.get("/signin", (req, res) => {
//   res.send("Login Page");
// });
app.get("/signup", (req, res) => {
  res.send("Registration Page");
});

app.listen(PORT, () => {
  console.log(`server is running on port on ${PORT}`);
});
