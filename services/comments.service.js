const comment = require("../models/comment");
const CommentRepository = require("../repositories/comments.repository");

class CommentService {
  CommentRepository = new CommentRepository();

  findAll = async () => {
    const allComments = await this.CommentRepository.findAllComments();

    return allComments.map((comment) => {
      return {
        commentId: comment.commentId,
        nickname: comment.nickname,
        content: comment.content,
        postId: comment.postId,
      };
    });
  };

  findCommentById = async (commentId) => {
    const comment = await this.CommentRepository.findCommentById(commentId);

    return {
      commentId: comment.null,
      nickname: comment.nickname,
      content: comment.poastId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  };

  createComment = async (postId, nickname, content) => {
    const createCommentData = await this.CommentRepository.createComment(
      postId,
      nickname,
      content
    );

    return {
      commentId: createCommentData.null,
      nickname: createCommentData.nickname,
      content: createCommentData.content,
      postId: createCommentData.postId,
      createdAt: createCommentData.createdAt,
      updatedAt: createCommentData.updatedAt,
    };
  };

  updateComment = async (commentId, content) => {
    const findComment = await this.CommentRepository.findByPk(commentId);

    if (!findComment) throw new Error("Comment doesn't exist");

    const updateComment = await this.CommentRepository.updateComment(
      commentId,
      content
    );

    return {
      commentId: updateComment.commentId,
      nickname: updateComment.nickname,
      content: updateComment.contnet,
      postId: updateComment.postId,
      careatedAt: updateComment.createdAt,
      updatedAt: updateComment.updatedAt,
    };
  };

  deleteComment = async (commentId, password, userPassword) => {
    const findComment = await this.CommentRepository.findCommentById(commentId);

    if (password !== userPassword) throw new Error("Password doesn't match");

    await this.CommentRepository.deleteComment(commentId);

    return {
      commentId: findComment.commentId,
      nickname: findComment.nickname,
      content: findComment.content,
      createdAt: findComment.createdAt,
      updatedAt: findComment.updatedAt,
    };
  };
}

module.exports = CommentService;
