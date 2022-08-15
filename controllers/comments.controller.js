const CommentService = require("../services/comments.service");

class CommentController {
  CommentService = new CommentService();

  getComments = async (req, res, next) => {
    const comments = await this.CommentService.findAll();

    res.status(200).json({ data: comments });
  };

  getCommentById = async (req, res, next) => {
    const { commentId } = req.params;
    const comment = await this.CommentService.findCommentById(commentId);

    res.status(200).json({ data: comment });
  };

  createComment = async (req, res, next) => {
    const { content } = req.body;
    const { postId } = req.params;
    const { user } = res.locals;

    const createCommentData = this.CommentService.createComment(
      postId,
      user.nickname,
      content
    );

    res.status(200).json({ data: createCommentData });
  };

  updateComment = async (req, res, next) => {
    const { password, content } = req.body;
    const { user } = res.locals;
    const { commentId } = req.params;

    const findComment = await this.CommentService.findCommentById(commentId);

    if (!findComment) throw new Error("Comment doesn't exist");

    const updateCommentData = await this.CommentService.updateComment(
      commentId,
      content
    );

    res.status(200).json({ data: updateCommentData });
  };

  deleteComment = async (req, res, next) => {
    const { password } = req.body;
    const { commentId } = req.params;
    const { user } = res.locals;

    const deleted = await this.CommentService.deleteComment(
      commentId,
      password,
      user.password
    );

    res.status(200).json({ data: deleted });
  };
}

module.exports = CommentController;
