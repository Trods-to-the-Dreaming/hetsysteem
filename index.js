const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'your_secret_key', // A secret key used to sign the session ID cookie
  resave: false, // Forces the session to be saved back to the session store
  saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store
  cookie: {
    maxAge: 3600000, // Sets the cookie expiration time in milliseconds (1 hour here)
    httpOnly: true, // Reduces client-side script control over the cookie
    secure: true, // Ensures cookies are only sent over HTTPS
  }
}));

app.get('/', (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`Number of views: ${req.session.views}`);
  } else {
    req.session.views = 1;
    res.send('Welcome to this page for the first time!');
  }
});

const server = app.listen(3000, () => {
  console.log('Server running on port 3000...');
});


/*//--- 3rd party modules ---//
const express = require("express");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

//--- Error messages ---//
const MSG_SERVER_STARTED = "Server gestart via poort ";

// --- Environmental variables ---//
dotenv.config({ path: path.join(__dirname, ".env")});

//--- Initialize server ---//
const app = express();

//--- Middlewares ---//
// Express MySQL Session
const sessionStore = new MySQLStore({
	host: process.env.DB_HOST,
	port: 3306,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

// Express Session
app.set("trust proxy");
app.use(
	session({
		name: 'session_cookie_name',
		proxy: true,//process.env.NODE_ENV === "production",
		secret: process.env.SESSION_SECRET,
		store: sessionStore,
		resave: true,//false,
		saveUninitialized: true,//false,
		cookie: { 
			secure: true//process.env.NODE_ENV === "production"
		}
	})
);

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
		layoutsDir: path.join(__dirname, "src/views/layouts"),
		partialsDir: path.join(__dirname, "src/views/partials")
	})
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Public directory
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Local variables for the navigation bar
app.use((req, res, next) => {
    //res.locals.sessionID = req.sessionID;
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
		const routerModule = require(path.join(routersPath, file));
		const router = routerModule.router;
		app.use(router);
	}
});

//--- Start server ---//
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(MSG_SERVER_STARTED + PORT);
});*/