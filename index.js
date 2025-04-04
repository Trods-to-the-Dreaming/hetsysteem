const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie session middleware
app.use(cookieSession({
  name: 'session',
  keys: ['your_secret_key'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: false,      // Ensures the cookie is only sent over HTTPS
  httpOnly: true,    // Prevents client-side JavaScript from accessing the cookie
  sameSite: 'strict' // Helps protect against CSRF attacks
}));

// Route to serve the login form
app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="post">
      <input type="text" name="username" placeholder="Enter your username" required />
      <button type="submit">Login</button>
    </form>
  `);
});

// Route to handle login form submission
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    req.session.username = username;
    //res.send(`Welcome, ${username}!`);
	res.redirect('/dashboard');
  } else {
    res.status(400).send('Username is required.');
  }
});

// Route to handle user dashboard
app.get('/dashboard', (req, res) => {
  if (req.session.username) {
    res.send(`Hello, ${req.session.username}. Welcome to your dashboard.`);
  } else {
    res.status(401).send('Unauthorized. Please log in.');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});




/*const express = require('express');
const session = require('express-session');
const MySQLStore = require("express-mysql-session")(session);

const app = express();

// Trust the first proxy in case the app is behind one (e.g., on Combell)
app.set('trust proxy', 1);

const sessionStore = new MySQLStore({
	host: process.env.DB_HOST,
	port: 3306,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

app.use(
	session({
		name: 'session_cookie_name',
		proxy: true,//process.env.NODE_ENV === "production",
		secret: process.env.SESSION_SECRET,
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
		cookie: { 
			secure: true,//process.env.NODE_ENV === "production"
			httpOnly: true, // Cookie is not accessible via JavaScript
			sameSite: strict,
			maxAge: 24 * 60 * 60 * 1000 // 24 hours
		}
	})
);

// Middleware to track page views
app.use((req, res, next) => {
  if (!req.session.views) {
    req.session.views = 0;
  }
  req.session.views++;
  next();
});

// Route to display the number of page views
app.get('/', (req, res) => {
  res.send(`Number of page views: ${req.session.views}`);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



//--- 3rd party modules ---//
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