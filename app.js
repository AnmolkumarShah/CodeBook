const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require('connect-flash');
const ErrorController = require('./controllers/404controller');

const mongoDBUrl = "mongodb+srv://anmolshah:anmolshah@cluster0.c6704.mongodb.net/<dbname>?retryWrites=true&w=majority";
const app = express();
const store = new MongoDBSession({ uri: mongoDBUrl, collection: "Sessions" });

const User = require("./models/user");

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded());
app.use(
  session({
    secret: "mySecretString",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.set("view engine", "ejs");
app.set("views", "views");

const csrfProtection = csrf();
app.use(flash());

const authRouter = require("./routers/authRouter");
const indexRouter = require("./routers/indexRouter");
const compilerRouter = require("./routers/compilerRouter");
const userRouter = require("./routers/userRoutes");
const exploreRouter = require("./routers/exploreRouter");

app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});


app.use(indexRouter);
app.use(authRouter);
app.use("/compiler", compilerRouter);
app.use(async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user._id);
    if(user){
      req.user = user;
    }else{
      res.redirect('/');
    }
    next();
  } catch (err) {
    console.log(err);
  }
});
app.use("/explore",exploreRouter);
app.use("/user", userRouter);
app.use(ErrorController.get404);

mongoose
  .connect(mongoDBUrl)
  .then(async () => {
    console.log("Connected to MongoDb");
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`listening to ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
