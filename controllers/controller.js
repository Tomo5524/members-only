var express = require("express");
var User = require("../models/user");

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
  console.log(req.body, "currentUser/////");
  res.render("login", { title: "Login", user: req.user });
};

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

// module.exports = router;
