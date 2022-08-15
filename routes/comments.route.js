const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const CommentController = require("../controllers/comments.controller");
const commentController = new CommentController();

router.get("/", commentController.getComments);
router.get("/:postId", commentController.getCommentById);
router.post("/:postId", authMiddleware, commentController.createComment);
router.put("/:commentId", authMiddleware, commentController.updateComment);
router.delete("/:commentId", authMiddleware, commentController.deleteComment);

module.exports = router;
