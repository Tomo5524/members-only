var express = require("express");
var router = express.Router();

const signup_controller = require("./sign-up");
// const login_controller = require("./login");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", signup_controller.login_get);
// router.get("/login", signup_controller.login_post);

router.get("/sign-up", signup_controller.signup_get);
router.post("/sign-up", signup_controller.signup_post);

module.exports = router;

// var express = require("express");
// // var app = require("../app");
// var app = express();
// // var router = express.Router();
// const mongoose = require("mongoose");
// const session = require("express-session");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcryptjs");

// var User = require("../models/user");

// // needs model module
// require("dotenv").config();
// const mongoDb = process.env.MONGODB_URI;
// mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "mongo connection error"));

// passport.use(
//   new LocalStrategy((username, password, done) => {
//     User.findOne({ username: username }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, { msg: "Incorrect username" });
//       }
//       if (user.password !== password) {
//         return done(null, false, { msg: "Incorrect password" });
//       }
//       return done(null, user);
//     });
//   })
// );

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

// // session middleware
// app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// /* GET home page. */
// exports.signup_get = function (req, res, next) {
//   res.render("sign-up", { title: "SignUp" });
// };

// app.post("/sign-up", (req, res, next) => {
//   bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
//     // if err, do something
//     if (err) {
//       return next(err);
//     }
//     // otherwise, store hashedPassword in DB
//     // use hashedPassword when saving data to mongoDB.
//     const user = new User({
//       username: req.body.username,
//       //   password: req.body.password, // not hashed so wnot match
//       password: hashedPassword, // hased pwd, returns "$2a$10$/CSA/6FrrB7h.FLXcBA3auQRdx9qWUzh8kL4dOyY7MQLK9G8ULfyS"
//     }).save((err) => {
//       if (err) {
//         return next(err);
//       }
//       res.redirect("/");
//     });
//   });
// });

// // exports.signup_post = function (req, res, next) {
// //   const user = new User({
// //     username: req.body.username,
// //     password: req.body.password
// //   }).save(err => {
// //     if (err) {
// //       return next(err);
// //     };
// //     res.redirect("/");
// //   });
// // };

// exports.login_get = function (req, res, next) {
//   res.render("login", { title: "Login" });
// };

// app.post(
//   "/log-in",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/",
//   })
// );

// // module.exports = router;
