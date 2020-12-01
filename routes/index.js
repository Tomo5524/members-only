var express = require("express");
var router = express.Router();
var app = express();
const bcrypt = require("bcryptjs");

var User = require("../models/user");
const Controllers = require("../controllers/controller");
// const login_controller = require("./login");

// const session = require("express-session");
const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;

// passport.use(
//   new LocalStrategy((username, password, done) => {
//     User.findOne({ username: username }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, { msg: "Incorrect username" });
//       }
//       bcrypt.compare(password, user.password, (err, res) => {
//         if (res) {
//           // passwords match! log user in
//           return done(null, user);
//         } else {
//           // passwords do not match!
//           return done(null, false, { msg: "Incorrect password" });
//         }
//       });
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

// app.use(function (req, res, next) {
//   res.locals.currentUser = req.user;
//   next();
// });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", Controllers.login_get);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/login",
    failureRedirect: "/login",
  })
);

router.get("/sign-up", Controllers.signup_get);

router.post("/sign-up", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    // if err, do something
    if (err) {
      return next(err);
    }
    if (req.body.password !== req.body.confirmPassword) {
      return next(err);
    }
    const user = new User({
      username: req.body.username,
      password: hashedPassword, // hased pwd, returns "$2a$10$/CSA/6FrrB7h.FLXcBA3auQRdx9qWUzh8kL4dOyY7MQLK9G8ULfyS"
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

router.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
