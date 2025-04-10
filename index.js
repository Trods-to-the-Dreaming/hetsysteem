const express = require('express');
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql2");
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');

dotenv.config({ path: path.join(__dirname, ".env")});

const app = express();

const sessionStore = new MySQLStore({
	host: process.env.DB_HOST,
	port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.set('trust proxy', 1);

app.use(session({
  key: 'session_cookie_name',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, //process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

sessionStore.onReady().then(() => {
	console.log('MySQLStore ready');
}).catch(error => {
	console.error(error);
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <form action="/login" method="post">
      <input type="text" name="username" placeholder="Enter your username" required />
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    req.session.username = username;
	res.redirect('/welcome');
  } else {
    res.status(400).send('Username is required.');
  }
});

app.get('/welcome', (req, res) => {
  if (req.session.username) {
    res.send(`Welcome, ${req.session.username}.`);
  } else {
    res.status(401).send('Unauthorized. Please log in.');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});