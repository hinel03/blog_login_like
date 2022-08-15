const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const PostsController = require("../controllers/posts.controller");
const postsController = new PostsController();

router.get("/", postsController.getPosts);
router.get("/:postId", postsController.getPostById);
router.post("/", authMiddleware, postsController.createPost);
router.put("/:postId", authMiddleware, postsController.updatePost);
router.delete("/:postId", authMiddleware, postsController.deletePost);
router.post("/like/:postId", authMiddleware, postsController.likePost);
router.delete("/dislike/:postId", authMiddleware, postsController.dislikePost);

module.exports = router;
