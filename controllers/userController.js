const Program = require("../models/program");

exports.postSaveCode = async (req, res, next) => {
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

exports.getCodeBook = async (req, res, next) => {
  await req.user.populate("book.items.programId");
  await req.user.execPopulate();
  const programs = await req.user.book.items;
  res.render("codebook.ejs", {
    pageTitle: "CodeBook - My Book",
    path: "/mybook",
    programs: programs
  });
};

exports.togglePublic = async (req,res,next)=>{
  const id = req.body.programId;
  const program = await Program.findById(id);

  const prev_value = program.public;
  program.public = !prev_value;
  await program.save();
  res.redirect('/user/mybook');
};

exports.toggleStared = async (req,res,next)=>{
  const id = req.body.programId;
  const program = await Program.findById(id);

  const prev_value = program.stared;
  program.stared = !prev_value;
  await program.save();
  res.redirect('/user/mybook');
};

exports.postDeleteProgram = async (req,res,next) => {
  const id = req.body.programId;
  try{
    await req.user.deleteProgram(id);
    await Program.deleteOne({_id : id});
    res.redirect('/user/mybook');
  }catch(err){
    console.log(err);
  }
}
