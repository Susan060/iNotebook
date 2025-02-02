const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

//Create a user using Post "/api/auth/". Doesnt require auth
router.post(
  "/",
  [
    body("username","Enter a Valid username").isLength({ min: 3 }),
    body("email","Enter a Valid Email").isEmail(),
    body("password","Password must be atleast 8 character").isLength({ min: 8 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      }).then(user => res.json(user))
      .catch(err=> {console.log(err)
      res.json({error:'Please enter a unique value for Email',message:err.message})})
  }
);
module.exports = router;
