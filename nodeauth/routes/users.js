var express = require("express");
var router = express.Router();
var multer = require("multer");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var upload = multer({ dest: "./uploads" });
var User = require("../models/user");
/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});
router.get("/register", function(req, res, next) {
  res.render("register", { title: "Register", errors: false });
});

router.post("/register", upload.single("profile-image"), function(
  req,
  res,
  next
) {
  var name = req.body.name,
    email = req.body.email,
    username = req.body.username,
    password = req.body.password,
    password2 = req.body.password2;
  if (req.file) {
    console.log("Uploading file..");
    var profileImage = req.file.filename;
  } else {
    console.log("No file uploaded..");
    var profileImage = "noimage.jpeg";
  }

  // Form validation
  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("email", "Email field is required").notEmpty();
  req.checkBody("email", "Email field is required").isEmail();
  req.checkBody("username", "Username field is required").notEmpty();
  req.checkBody("password", "Password field is required").notEmpty();
  req.checkBody("password2", "Password do not match").equals(req.body.password);

  // Check errors
  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("register", { errors: errors });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileImage
    });
    User.createUser(newUser, function(err, user) {
      if (err) throw err;
      req.flash("success", "You are now registered and can login");
      res.location("/");
      res.redirect("/");
    });
  }
});

router.get("/login", function(req, res, next) {
  res.render("login", { title: "Login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Invalid username or password"
  }),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    req.flash("success", "You are now logged in!");
    res.redirect("/");
  }
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "Unknown User" });
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid Password" });
        }
      });
    });
  })
);
module.exports = router;
