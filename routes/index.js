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
router.get("/add-message", Controllers.add_message);
router.post("/add-message", Controllers.add_message_post);
router.get("/user/:id/edit", Controllers.edit_user);
router.post("/user/:id/edit", Controllers.edit_user_post);
router.get("/user/:id/delete", Controllers.delete_user);
router.post("/user/:id/delete", Controllers.delete_user_post);
router.get("/admin", Controllers.admin_get);
router.post("/admin", Controllers.admin_post);

// when login fails, populate error message
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
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
    // display error message
    if (req.body.password !== req.body.confirmPassword) {
      res.render("sign-up", {
        title: "SignUp",
        errorMessage: "password and confirmPassword must be the same ",
      });
      return;
    }
    const user = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword, // hased pwd, returns "$2a$10$/CSA/6FrrB7h.FLXcBA3auQRdx9qWUzh8kL4dOyY7MQLK9G8ULfyS"
      joinedDate: moment().format("ll"),
      messages: [],
    }).save((err) => {
      if (err) {
        return next(err);
      }
      console.log("login succssed");
      res.redirect("/login");
    });
  });
});

router.get("/allusers", Controllers.allusers);

router.get("/allmessages", Controllers.allmessages);

router.get("/log-out", (req, res) => {
  User.findByIdAndUpdate(
    req.user.id,
    { $set: { isAdmin: false } },
    function (err, new_message) {
      if (err) {
        return next(err);
      }
      req.logout();
      res.redirect("/");
    }
  );
});

module.exports = router;
