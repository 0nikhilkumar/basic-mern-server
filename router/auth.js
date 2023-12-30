const express = require("express");
const router = express.Router();
const User = require("../model/userSchema.js");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate.js");

require("../db/mongoConn.js");

router.get("/", (req, res) => {
  res.send("Hello from the Home Page");
});

// REGISTRATION API
router.post("/register", async (req, res) => {
  try {
    const { name, email, work, phone, password, cpassword } = req.body;

    if (!name || !email || !work || !phone || !password || !cpassword) {
      res.status(422).json({ error: "Please fill all the field properly" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(422).json({ error: "Invalid Credentials" });
    } else if (password != cpassword) {
      res.status(400).json({ error: "password doesn't matched" });
    } else {
      const user = new User({ name, email, work, phone, password, cpassword });
      await user.save();
      res.status(201).json({ message: "User successfully registerd" });
    }
  } catch (err) {
    console.log(err);
  }
});

// SIGNIN API
router.post("/signin", async (req, res) => {
  let token;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please fill all the field properly" });
    }

    const loginUser = await User.findOne({ email });
    // console.log(loginUser);

    if (loginUser) {
      const isMatch = await bcrypt.compare(password, loginUser.password);

      token = await loginUser.generateAuthToken();

      console.log(token);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        return res
          .status(200)
          .cookie("jwtoken", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          })
          .json({ message: "user signin successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// about us page

router.get("/about", authenticate, (req, res) => {
  console.log(`Hello about page`);
  res.send(req.rootUser);
});

router.get("/getdata", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("error in contact form");
      return res.json({ error: "Please fill the contact form" });
    }

    const userContact = await User.findOne({ _id: req.userID });

    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );

      await userContact.save();
      res.status(201).json({ message: "message send successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", authenticate, (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send('User Logout')
});

module.exports = router;
