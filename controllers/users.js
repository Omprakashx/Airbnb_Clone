const User = require("../models/User.js")

module.exports.renderSignUpForm = (req, res) => {
  res.render("./users/user.ejs");
  //res.send("form");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    //console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "welcome to wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("./signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./users/Login.ejs");
};
module.exports.Login = async (req, res) => {
  req.flash("success", "welcome to wanderlust! You are logged in!");
  let redirectUrl = res.locals.redirectUrl || "./listings";
  res.redirect(redirectUrl);
};

module.exports.Logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("./listings");
  });
};
