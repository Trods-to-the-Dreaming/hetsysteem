//--- Load dependencies ---//
import dotenv from "dotenv";
import path from "path";
import express from "express";
import expressSession from "express-session";
import expressHandlebars from "express-handlebars";
import fs from "fs";
import { pathToFileURL } from "url";
import Knex from "knex";
import { ConnectSessionKnexStore  } from "connect-session-knex";
//const { default: connectSessionKnex } = await import("connect-session-knex");
//const SessionStore = KnexSessionStore(expressSession);

//--- Error messages ---//
const MSG_SERVER_STARTED = "Server gestart via poort ";
const MSG_MYSQLSTORE_READY = "Knex MySQL store klaar voor gebruik";

// --- Environmental variables ---//
dotenv.config({ path: path.join(process.cwd(), ".env")});

//--- Initialize server ---//
const app = express();

//--- Middlewares ---//
// Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public directory
const publicDir = path.join(process.cwd(), "public");
app.use(express.static(publicDir));

// MySQL connection setup with Knex
const knex = Knex({
	client: "mysql2",
	connection: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	},
});
const sessionStore = new ConnectSessionKnexStore ({
	knex,
	tablename: "sessions",
	createtable: true,
	sidfieldname: "session_id",
});

// Express Session with Knex Store
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
			block(name, options) {
				if (!this._blocks) this._blocks = {};
				this._blocks[name] = options.fn(this);
				return null;
			}
		},
		extname: "hbs",
		defaultLayout: "main",
		layoutsDir: path.join(process.cwd(), "src/views/layouts"),
		partialsDir: path.join(process.cwd(), "src/views/partials")
	})
);
app.set("view engine", "hbs");
app.set("views", path.join(process.cwd(), "src/views"));

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
const routersPath = path.join(process.cwd(), "src/routes");
fs.readdirSync(routersPath).forEach((file) => {
	if (file.endsWith(".js")) {
		const fullPath = path.join(routersPath, file);
		import(pathToFileURL(fullPath).href).then((router) => {
			app.use(router.default);
		});
	}
});

//--- Start server ---//
app.listen(process.env.APP_PORT, () => {
	console.log(MSG_SERVER_STARTED + process.env.APP_PORT);
	console.log(MSG_MYSQLSTORE_READY);
});