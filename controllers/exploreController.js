const Program = require("../models/program");

exports.getExplore = async (req, res, next) => {
  let message = req.flash("greetMessage");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const programs = await Program.find({public : true});
  res.render("explore.ejs", {
    pageTitle: "CodeBook - Explore",
    path: "/explore",
    programs: programs,
  });
};

exports.postAddToBook = async (req,res,next) => {
  const heading = req.body.heading;
  const code = req.body.code;
  const language = req.body.language;
  try {
    const program = new Program({
      heading: heading,
      code: code,
      language: language,
      date: Date.now(),
      public:false,
      stared:false,
      userId: req.user
    });
    await program.save();
    await req.user.addToBook(program._id);
    res.redirect("/user/mybook");
  } catch (err) {
    console.log(err);
  }
};

