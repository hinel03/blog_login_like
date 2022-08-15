const express = require("express");
const router = express.Router();

const postRouter = require("./posts.route");
const commentRouter = require("./comments.route");
const userRouter = require("./users.route");

router.use("/posts", [postRouter]);
router.use("/comments", [commentRouter]);
router.use("/users", [userRouter]);

module.exports = router;
