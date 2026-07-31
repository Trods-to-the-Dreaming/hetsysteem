import express from 'express';
import expressSession from 'express-session';
import expressHandlebars from 'express-handlebars';
//-----------------------------------------------------------------------------------------------//
import path from 'path';
//-----------------------------------------------------------------------------------------------//
import fs from 'fs';
//-----------------------------------------------------------------------------------------------//
import { pathToFileURL } from 'url';
//-----------------------------------------------------------------------------------------------//
import knex from './src/utils/db.js';
import { ConnectSessionKnexStore } from 'connect-session-knex';
//-----------------------------------------------------------------------------------------------//
import systemRouter  from '#modules/system/routes.js';
import accountRouter from '#modules/account/routes.js';
import gameRouter  	 from '#modules/game/routes.js';
//import cronRouter from '#modules/cron/routes.js';
import errorRouter 	 from '#modules/error/routes.js';

//===============================================================================================//

const MSG_SERVER_STARTED = 'Server gestart via poort ';
const MSG_MYSQLSTORE_READY = 'Knex MySQL store klaar voor gebruik';

//===============================================================================================//

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const publicDir = path.join(process.cwd(), 'public');
app.use(express.static(publicDir));

//===============================================================================================//

const sessionStore = new ConnectSessionKnexStore ({
	knex:        knex,
	tablename:   'sessions',
	createtable: false
});
await sessionStore.ready;

app.set('trust proxy', 1);
app.use(expressSession({
	name:              'systeem_session_cookie',
	secret:            process.env.SESSION_SECRET,
	store:             sessionStore,
	resave:            false,
	saveUninitialized: false,
	rolling:           true,
	cookie: {
		secure: process.env.NODE_ENV === 'production', // bug in Combell
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	}
}));

//===============================================================================================//

app.engine('hbs',
	expressHandlebars.engine({
		helpers: {
			gt:  (a, b) => a > b,
			eq:  (a, b) => a === b,
			lt:  (a, b) => a < b,
			and: (a, b) => a && b,
			or:  (a, b) => a || b,
			not: (a) => !a,
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
			json: (context) => JSON.stringify(context ?? null)
		},
		extname:       'hbs',
		defaultLayout: 'main',
		layoutsDir:    path.join(process.cwd(), 'src/views/layouts'),
		partialsDir:   path.join(process.cwd(), 'src/views/partials')
	})
);
app.set('view engine', 'hbs');
app.set('views', path.join(process.cwd(), 'src/views'));

//===============================================================================================//

app.use((req, res, next) => {
	res.locals.authenticated = Boolean(req.session?.user);
	next();
});

//===============================================================================================//

app.use('/', 		systemRouter);
app.use('/account', accountRouter);
app.use('/game', 	gameRouter);
//app.use('/cron', cronRouter);
app.use('/error', 	errorRouter);

//===============================================================================================//

app.use((err, req, res, next) => {
	console.error(err);
	
	const status = err.status || 500;
	
	if (req.headers.accept?.includes('application/json')) {
		return res.status(status).json({ redirect: `/errors/${status}` });
	}
	
	res.status(status).render(`errors/${status}`);
});

//===============================================================================================//

app.listen(process.env.APP_PORT, () => {
	console.log(MSG_SERVER_STARTED + process.env.APP_PORT);
	console.log(MSG_MYSQLSTORE_READY);
});