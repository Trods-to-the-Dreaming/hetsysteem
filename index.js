const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const expressSession = require("express-session");
const expressHandlebars = require("express-handlebars");
const fs = require("fs");

const MySQLStore = require('express-mysql-session')(expressSession);

//--- Error messages ---//
const MSG_SERVER_STARTED = "Server gestart via poort ";
const MSG_MYSQLSTORE_READY = "MySQL store klaar voor gebruik";

// --- Environmental variables ---//
dotenv.config({ path: path.join(__dirname, ".env")});

//--- Initialize server ---//
const app = express();

//--- Middlewares ---//
// Express
app.use(express.urlencoded({extended: "true"}));
app.use(express.json());

// Public directory
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Express MySQL Session
const sessionStore = new MySQLStore({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD  
});
sessionStore.onReady().then(() => {
	console.log(MSG_MYSQLSTORE_READY);
}).catch(error => {
	console.error(error);
});

// Express Session
app.set("trust proxy", 1);
app.use(expressSession({
	name: "systeem_session_cookie",
	secret: process.env.SESSION_SECRET,
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	rolling: true,
	cookie: {
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	}
}));

// Express Handlebars
app.engine("hbs",
	expressHandlebars.engine({
		helpers: {
			block: function (name, options) {
				if (!this._blocks) this._blocks = {};
				this._blocks[name] = options.fn(this);
				return null;
			}
		},
		extname: "hbs",
		defaultLayout: "main",
		layoutsDir: path.join(__dirname, "src/views/layouts"),
		partialsDir: path.join(__dirname, "src/views/partials")
	})
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

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
const routersPath = path.join(__dirname, "src/routes");
fs.readdirSync(routersPath).forEach((file) => {
	if (file.endsWith(".js")) {
		const router = require(path.join(routersPath, file));
		app.use(router);
	}
});

//--- Start server ---//
app.listen(process.env.APP_PORT, () => {
    console.log(MSG_SERVER_STARTED + process.env.APP_PORT);
});