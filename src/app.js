const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const bodyParser = require("body-parser");
//const authRoutes = require("./routes/auth");
//const mysql = require("mysql2")
const path = require("path");
//const dotenv = require("dotenv");
//const jwt = require("jsonwebtoken");
//const bcrypt = require("bcryptjs");
const fs = require("fs");

const app = express();

// Handlebars
app.engine("hbs", exphbs.engine({
	extname: "hbs",
	defaultLayout: "main",
	layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),

	}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Middleware
const publicDir = path.join(__dirname, "./public")

app.use(express.static(publicDir))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.urlencoded({extended: 'true'}))
app.use(express.json())

const routersPath = path.join(__dirname, "routes");

fs.readdirSync(routersPath).forEach((file) => {
  if (file.endsWith(".js")) {
    // dynamically import the router module
    const routerModule = require(path.join(routersPath, file));

    // get the "router" object exported by the router module
    const router = routerModule.router;

    // register the router
    app.use(router);
  }
});



// Routes
//app.use("/", authRoutes);

/*app.get("/", (req, res) => {
    res.render("index", { title: "Het Systeem" })
})

app.get("/login", (req, res) => {
    res.render("login", { title: "Het Systeem - Inloggen" })
})

app.get("/register", (req, res) => {
    res.render("register")
})



// Authentication login POST
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
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

// Authentication register POST
app.post("/auth/register", (req, res) => {
  const { username, password, password_confirm } = req.body;

  if (password !== password_confirm) {
    return res.render("register", { message: "Wachtwoorden komen niet overeen!" });
  }

  // Check if username already exists
  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
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

      db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err, result) => {
        if (err) {
          console.log(err);
          return res.send("Er is een fout opgetreden.");
        }

        return res.render("login", { message: "Registratie succesvol! Je kunt nu inloggen." });
      });
    });
  });
});*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
