const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Joi = require("joi");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "anmolkumar.20k@gmail.com",
    pass: "anmolkumar@google(vnsvmkdbrn)"
  }
});

exports.login = async (req, res, next) => {
  let message = req.flash("loginError");
  let guide = req.flash("loginGuide");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  if (guide.length > 0) {
    guide = guide[0];
  } else {
    guide = null;
  }
  res.render("login.ejs", {
    pageTitle: "CodeBook - Login",
    path: "/login",
    errorMessage: message,
    guideMessage: guide
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const Schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      _csrf: Joi.string(),
    });
    await Schema.validateAsync(req.body);

    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash("loginError", "Invalid Email or Password");
      return res.redirect("/login");
    } else {
      const doMatch = await bcrypt.compare(password, user.password);
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.flash("greetMessage", `Welcome Back, ${user.firstName}`);
        return res.redirect("/");
      } else {
        req.flash("loginError", "Invalid Email or Password");
        return res.redirect("/login");
      }
    }
  } catch (err) {
    req.flash("loginError", err.details[0].message);
    return res.redirect("/login");
  }
};

exports.postLogout = (req, res, next) => {
  try {
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (err) {
    console.log(err);
  }
};

exports.signup = async (req, res, next) => {
  let message = req.flash("signupError");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("signup.ejs", {
    pageTitle: "CodeBook - Signup",
    path: "/signup",
    errorMessage: message
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const Schema = Joi.object({
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      _csrf: Joi.string(),
      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
    });
    await Schema.validateAsync(req.body);

    const hashPass = await bcrypt.hash(password, 12);

    const user = await User.findOne({ email: email });
    if (user) {
      return res.redirect("/signup");
    } else {
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashPass,
        book: { items: [] }
      });
      await newUser.save();
      const mailOptions = {
        from: "anmolkumar.20k@gmail.com",
        to: email,
        subject: "Welcome to CodeBook !!!",
        html : `
          <h1>CodeBook</h1>
          <h3>Welcome, ${firstName}</h3>
          <p>It's an Online Compiler and interpreter which runs your code on the Web, plus with CodeBook you can save all of your executed programs safe in your Account and can revisit and rerun them anytime.</p>
          <p>Click this <a href="http://localhost:5000/compiler">link</a> to write your first code</p>
        `
      };

      await transport.sendMail(mailOptions);
      console.log("Email Sent !!");
      req.flash("loginGuide", "Now Please Login");
      res.redirect("/login");
    }
  } catch (err) {
    req.flash("signupError", err.details[0].message);
    res.redirect("/signup");
    // console.log(err);
  }
};

exports.getResetPassword = async (req, res, next) => {
  let message = req.flash("resetError");
  let guide = req.flash("loginGuide");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  if (guide.length > 0) {
    guide = guide[0];
  } else {
    guide = null;
  }
  res.render("reset.ejs", {
    pageTitle: "CodeBook - Reset Password",
    path: "/reset",
    errorMessage: message,
    guideMessage: guide
  });
};

exports.postResetPassword = async (req, res, next) => {
  try {
    const buffer = await crypto.randomBytes(32);
    const token = buffer.toString("hex");
    // console.log(token);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("resetError", "No account with that email found !!!");
      return res.redirect("/reset");
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    const mailOptions = {
      from: "anmolkumar.20k@gmail.com",
      to: req.body.email,
      subject: "Reset Password - CodeBook",
      html: `
        <h1>CodeBook</h1>
        <h2>Reset Password</h2>
        <p>You requested for a Password Reset</p>
        <p>Click this <a href="http://localhost:5000/reset/${token}">link</a> to reset your Password</p>
        <p>This is Valid only for 1 hour, after that, this link will be of no use, be fast</p>
      `
    };
    await transport.sendMail(mailOptions);
    console.log("Email Sent !!");
    req.flash("greetMessage", `${user.firstName}, Check your Email`);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });
    if (!user) {
      return res.redirect("/login");
    }
    let message = req.flash("loginError");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("new-password.ejs", {
      pageTitle: "CodeBook - New Password",
      path: "/login",
      errorMessage: message,
      userId: user._id.toString(),
      token: token
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const tokenPassword = req.body.token;

  console.log(newPassword);
  console.log(userId);
  console.log(tokenPassword);

  try {
    const user = await User.findOne({
      resetToken: tokenPassword.toString(),
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    });

    console.log(user);

    if (!user) {
      req.flash("loginError", "Error in resetting password");
      return res.redirect("/login");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    req.flash("loginError", "Your password changed");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};
