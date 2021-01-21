exports.get404 = (req, res, next) => {
  console.log("Here");
  res.status(404).render("404page.ejs", {
    pageTitle: "404 Not Found",
    path: "/404",
  });
};
