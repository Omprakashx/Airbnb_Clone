const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRediredctUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signup));

router
  .route("/Login")
  .get(userController.renderLoginForm)
  .post(
    saveRediredctUrl,
    passport.authenticate("local", {
      failureRedirect: "./Login",
      failureFlash: true,
    }),
    userController.Login
  );

router.get("/logout", userController.Logout);

module.exports = router;
