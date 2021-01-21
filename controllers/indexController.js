exports.getIndex = (req, res, next) => {
  let message = req.flash("greetMessage");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("index.ejs", {
    pageTitle: "CodeBook",
    path: "/",
    msg: message,
  });
};
