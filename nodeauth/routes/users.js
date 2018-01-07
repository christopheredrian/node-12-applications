var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "./uploads" });

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
    res.render('register', {errors: errors});
  } else {
    res.send("done");
  }
});


router.get("/login", function(req, res, next) {
  res.render("login", { title: "Login" });
});
module.exports = router;
