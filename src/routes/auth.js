const express = require("express");
const router = express.Router();
const { Authentication } = require("../controllers/auth.js");

//router.get("/api/v1/users", UserController.getUsers);
//router.get("/api/v1/users/:userId", UserController.getUser);
router.get("/login", Authentication.showLogin);
router.post("/login", Authentication.handleLogin);
//router.put("/api/v1/users/:userId", UserController.updateUser);
//router.delete("/api/v1/users/:userId", UserController.deleteUser);


router.get("/test", Authentication.showTest);

module.exports = { router };