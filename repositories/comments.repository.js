const { Comment } = require("../models");
const { Post } = require("../models");

class CommentRepository {
  findAllComments = async () => {
    const comments = await Comment.findAll({ order: [["createdAt", "DESC"]] });

    return comments;
  };

  findCommentById = async (commentId) => {
    const comment = await Comment.findByPk(commentId);

    return comment;
  };

  createComment = async (postId, nickname, content) => {
    const selectedPost = await Post.findOne({ where: { postId } });
    if (!selectedPost) throw new Error("Post doesn't exist");

    const createCommentData = await Comment.create({
      postId,
      nickname,
      content,
    });

    return createCommentData;
  };

  updateComment = async (commentId, content) => {
    const updateCommentData = await Comment.update(
      { content },
      { where: { commentId } }
    );

    return updateCommentData;
  };

  deleteComment = async (commentId) => {
    const selectedComment = await Comment.findOne({ commentId });
    const postId = selectedComment.postId;
    const selectedPost = await Post.findOne({ postId });

    if (!selectedComment) throw new Error("Comment doesn't exist");

    const updateCommentData = await Comment.destroy({ where: { commentId } });

    return updateCommentData;
  };
}

module.exports = CommentRepository;
