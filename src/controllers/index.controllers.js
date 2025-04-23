//--- Show index page ---//
const showIndex = (req, res) => {
	res.redirect("/about");
};

//--- Show about page ---//
const showAbout = (req, res) => {
	res.render("about");
};

//--- Show game rules page ---//
const showRules = (req, res) => {
	res.render("rules");
};

//--- Export ---//
export default {
  showIndex,
  showAbout,
  showRules,
};