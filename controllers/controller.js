var express = require("express");
var moment = require("moment");
var User = require("../models/user");
var Message = require("../models/message");
const { body, validationResult } = require("express-validator");

/* GET home page. */
exports.signup_get = function (req, res, next) {
  res.render("sign-up", { title: "SignUp" });
};

exports.login_get = function (req, res, next) {
  // console.log("currentUser/////");
  // console.log(req.body, "currentUser///// in login get");
  // console.log(req.flash("error"), "error/////");
  res.render("login", { errorMessage: req.flash("error") });
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
      date: moment().format("ll"),
      userName: req.user.username,
      userId: req.user.id,
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
      // console.log(req.user.id);
      User.findByIdAndUpdate(
        req.user.id,
        {
          $push: {
            messages: {
              title: req.body.title,
              message: req.body.message,
              date: newMessage.date,
            },
          },
        },
        function (err, new_message) {
          if (err) {
            return next(err);
          }
        }
      );

      // console.log(allMessages);
      // allMessages.push(newMessage);
      ////
      newMessage.save(function (err) {
        if (err) {
          return next(err);
        }
        // add new message to user message array
        res.redirect("/");
      });
    }
  },
];

exports.edit_user = function (req, res, next) {
  // console.log(req.user, "currentUser/////"); work
  // console.log(currentUser, "currentUser/////"); not work
  res.render("edit-user", { title: "Edit User!" });
};

exports.edit_user_post = [
  // Validate and santise the name field.
  body("username", "Name must be between 1 and 30 characters")
    .isLength({ min: 1, max: 30 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    var user = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.user.password, // hased pwd, returns "$2a$10$/CSA/6FrrB7h.FLXcBA3auQRdx9qWUzh8kL4dOyY7MQLK9G8ULfyS"
      joinedDate: req.user.joinedDate,
      messages: req.user.messages,
      _id: req.params.id, //This is required, or a new ID will be assigned!
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
      // console.log(req.user.id);
      User.findByIdAndUpdate(
        req.params.id,
        user,
        {},
        function (err, new_message) {
          if (err) {
            return next(err);
          }
        }
      );
      // change message,
      Message.updateMany(
        { userName: req.user.username },
        { $set: { userName: req.body.username } },
        function (err, new_message) {
          if (err) {
            return next(err);
          }
        }
      );
      res.redirect(`/user/${req.params.id}`);
    }
  },
];

exports.delete_user = function (req, res, next) {
  User.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    if (result == null) {
      // No results.
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    // console.log(result, "result////////");
    res.render("delete-user", { result });
  });
};

exports.delete_user_post = function (req, res, next) {
  User.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    if (result == null) {
      // No results.
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    if (result.messages.length > 0) {
      // Author has books. Render in same way as for GET route.
      Message.deleteMany({ userId: req.params.id }, function DeleteUser(err) {
        if (err) {
          return next(err);
        }
      });
    }
    // Successful, so render.
    User.findByIdAndRemove(req.params.id, function DeleteUser(err) {
      if (err) {
        return next(err);
      }
      req.logout();
      res.redirect("/");
    });
  });
};

exports.user_detail = function (req, res, next) {
  User.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    if (result == null) {
      // No results.
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    // console.log(result, "result////////");
    res.render("user_detail", { result });
  });
};

exports.admin_get = function (req, res, next) {
  // console.log(req.user, "currentUser/////"); work
  // console.log(currentUser, "currentUser/////"); not work
  res.render("admin", { title: "Log In As Admin" });
};

exports.admin_post = [
  // Validate and santise the name field.
  body("password", "Incorrect Password")
    .custom((value, { req }) => value === process.env.AdminPASSWORD)
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    // console.log(req.body, "req.body///////");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      // console.log(req.body, "req.body///////");
      res.render("admin", {
        title: "Log In As Admin",
        errors: errors.array()[0].msg,
      });
      return;
    } else {
      // Data from form is valid.
      // Check if item with same name already exists.
      // Successful, so render.
      User.findByIdAndUpdate(
        req.user.id,
        { $set: { isAdmin: true } },
        function (err, new_message) {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        }
      );
    }
  },
];

// exports.log_out_post = function (req, res, next) {
//   User.findByIdAndUpdate(
//     req.user.id,
//     { $set: { isAdmin: false } },
//     function (err, new_message) {
//       if (err) {
//         return next(err);
//       }
//       res.redirect("/");
//     }
//   );
// };

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
