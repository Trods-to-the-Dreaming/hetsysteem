const express = require('express');
const mysql = require("mysql2")
const path = require("path")
const dotenv = require('dotenv')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

dotenv.config({ path: './.env'})

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

app.set('view engine', 'hbs')

db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

// Authentication register POST
app.post("/auth/register", (req, res) => {
  const { name, password, password_confirm } = req.body;

  if (password !== password_confirm) {
    return res.render("register", { message: "Wachtwoorden komen niet overeen!" });
  }

  // Check if username already exists
  db.query("SELECT * FROM users WHERE name = ?", [name], (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Er is een fout opgetreden.");
    }

    if (results.length > 0) {
      return res.render("register", { message: "Deze gebruikersnaam is al in gebruik." });
    }

    // Hash the password and insert the new user
    bcrypt.hash(password, 8, (err, hashedPassword) => {
      if (err) {
        console.log(err);
        return res.send("Er is een fout opgetreden.");
      }

      db.query("INSERT INTO users (name, password) VALUES (?, ?)", [name, hashedPassword], (err, result) => {
        if (err) {
          console.log(err);
          return res.send("Er is een fout opgetreden.");
        }

        return res.render("login", { message: "Registratie succesvol! Je kunt nu inloggen." });
      });
    });
  });
});


// Authentication login POST
app.post("/auth/login", (req, res) => {
  const { name, password } = req.body;

  // Check if user exists
  db.query("SELECT * FROM users WHERE name = ?", [name], (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Er is een fout opgetreden.");
    }

    if (results.length === 0) {
      return res.render("login", { message: "Gebruiker niet gevonden." });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        console.log(err);
        return res.send("Er is een fout opgetreden.");
      }

      if (match) {
        return res.redirect("/mainmenu");
      } else {
        return res.render("login", { message: "Ongeldig wachtwoord." });
      }
    });
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
