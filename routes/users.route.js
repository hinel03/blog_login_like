const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const UserController = require("../controllers/users.controller");
const userController = new UserController();

router.post("/", userController.createUser);
router.post("/login", userController.userLogin);
router.get("/me", authMiddleware, userController.findUser);
router.get("/likes", authMiddleware, userController.findUserLikes);

module.exports = router;
