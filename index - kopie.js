/*const express = require('express');
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
});*/






//--- 3rd party modules ---//
const express = require("express");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
//const session = require("express-session");
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const path = require("path");
//const fs = require("fs");
const db = require("./src/utils/db");
const bcrypt = require("bcryptjs");



//--- Error messages ---//
const MSG_SERVER_STARTED = "Server gestart via poort ";

const MSG_UNEXPECTED_ERROR = "Er is een fout opgetreden.";
const MSG_INVALID_LOGIN = "Ongeldige gebruikersnaam of wachtwoord.";
const MSG_PASSWORD_MISMATCH = "De wachtwoorden komen niet overeen.";
const MSG_USERNAME_TAKEN = "Deze gebruikersnaam is al in gebruik.";
const MSG_CURRENT_PASSWORD_WRONG = "Dit is niet uw huidige wachtwoord.";

// --- Environmental variables ---//
dotenv.config({ path: path.join(__dirname, ".env")});

//--- Initialize server ---//
const app = express();

//--- Middlewares ---//
// Express
app.use(express.urlencoded({extended: 'true'}));
app.use(express.json());

// Express Session
//app.use(
//	session({
//		name: 'session',
//		secret: process.env.SESSION_SECRET,
//		resave: false,
//		saveUninitialized: false,
//		cookie: { 
//			secure: process.env.NODE_ENV === "production",
//			httpOnly: true,
//			sameSite: 'strict',
//			maxAge: 24 * 60 * 60 * 1000 // 24 hours
//		}
//	})
//);

// Cookie Session
app.use(cookieSession({
  name: 'session',
  keys: ['your_secret_key'], //[process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: 'strict'
}));

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
//app.use((req, res, next) => {
//	if (req.session && req.session.username) {
//		res.locals.authenticated = true;
//		res.locals.username = req.session.username;
//	} else {
//		res.locals.authenticated = false;
//	}
//    next();
//});

// Routers
//const routersPath = path.join(__dirname, "src/routes");
//fs.readdirSync(routersPath).forEach((file) => {
//	if (file.endsWith(".js")) {
//		const routerModule = require(path.join(routersPath, file));
//		const router = routerModule.router;
//		app.use(router);
//	}
//});


app.get("/", (req, res) => {
	res.render("index");
});

app.get("/auth/login", (req, res) => {
	res.render("auth/login");
});
	
	//--- Handle login request ---//
app.post("/auth/login", (req, res) => {
	const { username, password } = req.body;

	// Check if username exists
	db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
		if (err) {
			console.log(err);
			return res.send(MSG_UNEXPECTED_ERROR);
		}

		// Username does not exist
		if (results.length === 0) {
			return res.render("auth/login", { login_error: MSG_INVALID_LOGIN });
		}

		// Check password
		const user = results[0];
		bcrypt.compare(password, user.password, (err, match) => {
			if (err) {
				console.log(err);
				return res.send(MSG_UNEXPECTED_ERROR);
			}

			if (match) {
				req.session.username = user.username;
				//return res.redirect("/game/menu");
				//console.log('Password Check - Session:', req.session, req.sessionID);
				//req.session.save((err) => {
				//	if (err) {
				//		console.log(err);
				//		return res.send(MSG_UNEXPECTED_ERROR);
				//	}
				//	res.redirect("/game/menu");
				//});
				res.redirect("/auth/account");
			} else {
				return res.render("auth/login", { login_error: MSG_INVALID_LOGIN });
			}
		});
	});
});

app.get("/auth/account", (req, res) => {
	res.render("auth/account");
});

//--- Start server ---//
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(MSG_SERVER_STARTED + PORT);
});