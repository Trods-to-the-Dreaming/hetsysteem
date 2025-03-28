const { Router } = require("express");
const { Index } = require("../controllers/index.js");

const router = new Router();

//router.get("/api/v1/users", UserController.getUsers);
//router.get("/api/v1/users/:userId", UserController.getUser);
router.get("/", Index.show);
//router.post("/authentication/login", Authentication.handleLogin);
//router.put("/api/v1/users/:userId", UserController.updateUser);
//router.delete("/api/v1/users/:userId", UserController.deleteUser);

module.exports = { router };