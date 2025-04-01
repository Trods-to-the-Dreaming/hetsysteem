//--- 3rd party modules ---//
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
//const jwt = require("jsonwebtoken");
const fs = require("fs");

//--- Error messages ---//
const MSG_SERVER_STARTED = "Server gestart via poort ";

//--- Initialize server ---//
const app = express();

//--- Middlewares ---//
// Express
app.use(express.urlencoded({extended: 'true'}));
app.use(express.json());

// Express Handlebars
app.engine("hbs",
	exphbs.engine({
		helpers: {
			block: function (name, options) {
				if (!this._blocks) this._blocks = {};
				this._blocks[name] = options.fn(this);
				return null;
			}
		},
		extname: "hbs",
		defaultLayout: "main",
		layoutsDir: path.join(__dirname, "views/layouts"),
		partialsDir: path.join(__dirname, "views/partials")
	})
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Express Session
app.use(
	session({
		secret: "secret-key",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false } // set to false on localhost
	})
);

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Public directory
const publicDir = path.join(__dirname, "../public");
app.use(express.static(publicDir));

// Local variables for the navigation bar
app.use((req, res, next) => {
    if (req.session && req.session.username) {
		res.locals.authenticated = true;
		res.locals.username = req.session.username;
	} else {
		res.locals.authenticated = false;
	}
    next();
});

// Routers
const routersPath = path.join(__dirname, "routes");
fs.readdirSync(routersPath).forEach((file) => {
	if (file.endsWith(".js")) {
		const routerModule = require(path.join(routersPath, file));
		const router = routerModule.router;
		app.use(router);
	}
});

//--- Start server ---//
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(MSG_SERVER_STARTED + PORT);
});