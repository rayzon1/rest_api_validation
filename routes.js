"use strict";

const express = require("express");
const { check, validationResult } = require("express-validator");
// This array is used to keep track of user records
// as they are created.
const users = [];

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get("/users", (req, res) => {
  res.json(users);
});

// Route that creates a new user.
router.post( "/users",
  [
    check("name")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("The name must have a value."),
    check("email")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide a valid email."),
    check("birthday")
      .exists({ checkNull: true, checkFalsy: true })
      .isISO8601()
      .withMessage("Please provide a valid date."),
    check("password")
      .exists({ checkNull: true, checkFalsy: true })
      .isLength({ options: { min: 8, max: 20}})
      .withMessage("Please provide a password between 8 and 20 characters long."),
    check("passwordConfirmation")
      .exists({ checkNull: true, checkFalsy: true })
      .isLength({ options: { min: 8, max: 20}})
      .custom((val, { req }) => {
        if(val && req.body.password && val !== req.body.password){
          throw new Error("The password and password confirmation fields do not match.");
        }

        return true;
      })

  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);

      res.status(400).json({ error: errorMessages });
    } else {
      const user = req.body;
      users.push(user);
      res.status(201).end();
    }
  }
);

module.exports = router;
