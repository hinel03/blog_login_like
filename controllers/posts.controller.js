const PostService = require("../services/posts.service");

class PostController {
  postService = new PostService();

  getPosts = async (req, res, next) => {
    const posts = await this.postService.findAllPost();

    res.status(200).json({ data: posts });
  };

  getPostById = async (req, res, next) => {
    const { postId } = req.params;
    const post = await this.postService.findPostById(postId);

    res.status(200).json({ data: post });
  };

  createPost = async (req, res, next) => {
    const { nickname, password, title, content } = req.body;
    const { user } = res.locals;
    const likes = 0;
    const createPostData = await this.postService.createPost(
      user.nickname,
      title,
      content,
      likes
    );

    res.status(200).json({ data: createPostData });
  };

  updatePost = async (req, res, next) => {
    const { postId } = req.params;
    const { user } = res.locals;
    const { title, content, password } = req.body;

    const updatePost = await this.postService.updatePost(
      postId,
      title,
      content,
      password,
      user.password
    );

    res.status(200).json({ data: updatePost });
  };

  deletePost = async (req, res, next) => {
    const { postId } = req.params;
    const { password } = req.body;
    const { user } = res.locals;

    const deletedPost = await this.postService.deletePost(
      postId,
      password,
      user.password
    );

    res.status(200).json({ data: deletedPost });
  };

  likePost = async (req, res, next) => {
    const { postId } = req.params;
    const { user } = res.locals;

    const createLikePostData = this.postService.likePost(postId, user.userId);

    res.status(200).json({ data: createLikePostData });
  };

  dislikePost = async (req, res, next) => {
    const { postId } = req.params;
    const { user } = res.locals;

    const updateLikePostData = this.postService.dislikePost(
      postId,
      user.userId
    );

    res.status(200).json({ data: updateLikePostData });
  };
}

module.exports = PostController;
