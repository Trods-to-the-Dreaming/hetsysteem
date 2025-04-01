const IndexController = {
	//--- Show index page ---//
	showIndex: (req, res) => {
		res.render("index");
	},
	
	//--- Show game rules page ---//
	showRules: (req, res) => {
		res.render("rules");
	}
};

module.exports = { IndexController };