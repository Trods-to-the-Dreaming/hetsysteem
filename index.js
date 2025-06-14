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
	knex: knex,
	tablename: "sessions",
	createtable: false
});
await sessionStore.ready;

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
			gt: (a, b) => a > b,
			eq: (a, b) => a === b,
			lt: (a, b) => a < b,
			block(name, options) {
				if (!this._blocks) this._blocks = {};
				this._blocks[name] = options.fn(this);
				return null;
			},
			range: function(start, end, options) {
				let result = '';
				for (let i = start; i <= end; i++) {
					result += options.fn(i);
				}
				return result;
			},
			json: context => JSON.stringify(context)
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
const routerImports = fs.readdirSync(routersPath).map(async (file) => {
	if (file.endsWith(".js")) {
		const fullPath = path.join(routersPath, file);
		const module = await import(pathToFileURL(fullPath).href);
		const { path: basePath, router } = module.default;
		app.use(basePath, router);
	}
});
await Promise.all(routerImports);

// Errors
app.use((err, req, res, next) => {
	console.error(err);

	const status = err.status || 500;
	res.status(status).render(`errors/${status}`, {
		message: err.expose ? err.message : null
	});
});
/*app.use((err, req, res, next) => {
	console.error(err.stack);
	const status = err.status || 500;

	if ([403, 404, 500].includes(status)) {
		return res.status(status).render(`errors/${status}`);
	}

	res.status(status).send("Er ging iets mis.");
});
app.use((req, res) => {
	res.status(404).render("errors/404");
});*/

//--- Start server ---//
app.listen(process.env.APP_PORT, () => {
	console.log(MSG_SERVER_STARTED + process.env.APP_PORT);
	console.log(MSG_MYSQLSTORE_READY);
});