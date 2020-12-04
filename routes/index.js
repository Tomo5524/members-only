var express = require("express");
var router = express.Router();

var User = require("../models/user");
var Message = require("../models/message");
const Controllers = require("../controllers/controller");
const passport = require("passport");
const bcrypt = require("bcryptjs");
var moment = require("moment");

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render("index", { title: "Express" });
  res.redirect("/home");
});

router.get("/home", function (req, res, next) {
  Message.find().exec(function (err, messages) {
    if (err) {
      return next(err);
    }
    // Successful, so render
    // console.log(items);
    // res.render("items", { title: "All the items", items });
    // res.status(200).json(users);
    res.render("index", { title: "Not So ClubHouse", messages });
  });
  // res.render("index", { title: "Not So ClubHouse" });
});

router.get("/login", Controllers.login_get);
router.get("/sign-up", Controllers.signup_get);
router.get("/user/:id", Controllers.user_detail);

// when login fails, populate error message
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/login",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post("/sign-up", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    // if err, do something
    if (err) {
      return next(err);
    }
    // check if user input of password and confirmedpassword are the same
    if (req.body.password !== req.body.confirmPassword) {
      return next(err);
    }
    const user = new User({
      username: req.body.username,
      password: hashedPassword, // hased pwd, returns "$2a$10$/CSA/6FrrB7h.FLXcBA3auQRdx9qWUzh8kL4dOyY7MQLK9G8ULfyS"
      joinedDate: moment().format("ll"),
      message: [],
    }).save((err) => {
      if (err) {
        return next(err);
      }
      console.log("login succssed");
      res.redirect("/login");
    });
  });
});

router.get("/add-message", Controllers.add_message);

router.post("/add-message", Controllers.add_message_post);

router.get("/allusers", Controllers.allusers);

router.get("/allmessages", Controllers.allmessages);

router.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
