const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken')
const JWT_SECRET="Susanisagood$"

//Create a user using Post "/api/auth/createuser". Doesnt require auth
router.post(
  "/createuser",
  [
    body("username", "Enter a Valid username").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password must be atleast 8 character").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    // If there are no errors, return Bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Check whether the user with this email exsits already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass =await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secPass,
      });
      const data={
        user:{
          id:user.id
        }
      }
      const authtoken=jwt.sign(data,JWT_SECRET);

      // .then(user => res.json(user))
      // .catch(err=> {console.log(err)
      // res.json({error:'Please enter a unique value for Email',message:err.message})})
      res.json({authtoken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);
module.exports = router;
