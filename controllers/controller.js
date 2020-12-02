var express = require("express");
var moment = require("moment");
var User = require("../models/user");
var Message = require("../models/message");
const { body, validationResult } = require("express-validator");

/* GET home page. */
exports.signup_get = function (req, res, next) {
  res.render("sign-up", { title: "SignUp" });
};

// exports.signup_post = function (req, res, next) {
//   const user = new User({
//     username: req.body.username,
//     password: req.body.password
//   }).save(err => {
//     if (err) {
//       return next(err);
//     };
//     res.redirect("/");
//   });
// };

exports.login_get = function (req, res, next) {
  // console.log("currentUser/////");
  // console.log(req.body, "currentUser///// in login get");
  res.render("login", { title: "Login" });
};

exports.add_message = function (req, res, next) {
  // console.log(req.user, "currentUser/////"); work
  // console.log(currentUser, "currentUser/////"); not work
  res.render("add-message", { title: "Add New Message" });
};

exports.add_message_post = [
  // Validate and santise the name field.
  body("title", "Name must be between 1 and 30 characters")
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("message", "Decription must be between 5 and 90 characters")
    .isLength({ min: 5, max: 90 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    var newMessage = new Message({
      title: req.body.title,
      message: req.body.message,
      date: moment().calendar(),
      userName: req.user.username,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages
      // console.log(errors, "error ////////");
      res.render("add-message", {
        title: "Add New Message",
        errors: errors.array()[0].msg,
      });
      return;
    } else {
      // Data from form is valid.
      newMessage.save(function (err) {
        if (err) {
          return next(err);
        }
        // Genre saved. Redirect to genre detail page.
        // console.log(new_genre);
        res.redirect("/");
      });
    }
  },
];

exports.allusers = function (req, res, next) {
  User.find().exec(function (err, users) {
    if (err) {
      return next(err);
    }
    // Successful, so render
    // console.log(items);
    // res.render("items", { title: "All the items", items });
    res.status(200).json(users);
  });
};

exports.allmessages = function (req, res, next) {
  Message.find().exec(function (err, messages) {
    if (err) {
      return next(err);
    }
    // Successful, so render
    // console.log(items);
    // res.render("items", { title: "All the items", items });
    res.status(200).json(messages);
  });
};

// module.exports = router;
