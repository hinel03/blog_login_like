const { Post } = require("../models");
const { LikePost } = require("../models");

class PostRepository {
  findAllPost = async () => {
    const posts = await Post.findAll({ order: [["createdAt", "DESC"]] });

    return posts;
  };

  findPostById = async (postId) => {
    const post = await Post.findByPk(postId);

    return post;
  };

  createPost = async (nickname, title, content, likes) => {
    const createPostData = await Post.create({
      nickname,
      title,
      content,
      likes,
    });

    return createPostData;
  };

  updatePost = async (postId, title, content) => {
    const updatePostData = await Post.update(
      { title, content },
      { where: { postId } }
    );

    const updatedData = await Post.findByPk(postId);
    return updatedData;
  };

  deletePost = async (postId, password) => {
    const updatePostData = await Post.destroy({ where: { postId } });

    return updatePostData;
  };

  likePost = async (postId, userId) => {
    const detailpost = await Post.findOne({ where: { postId } });

    const likedpost = await LikePost.findOne({ where: { postId, userId } });

    if (detailpost) {
      if (!likedpost) {
        await Post.update({ likes: this.likes + 1 }, { where: { postId } });
        const likePostData = await LikePost.create({ userId, postId });
        return detailpost;
      } else {
        throw new Error("already liked post");
      }
    } else {
      throw new Error("Post doesn't exist");
    }
  };

  dislikePost = async (postId, userId) => {
    const detailpost = await Post.findOne({ where: { postId } });
    const likedpost = await LikePost.findOne({ where: { postId, userId } });

    if (detailpost) {
      if (likedpost) {
        await LikePost.destroy({ where: { userId: userId, postId: postId } });
        await Post.update({ likes: this.likes - 1 }, { where: { postId } });
      } else {
        throw new Error("never liked the post before");
      }
    } else {
      throw new Error("Post doesn't exist");
    }
    return detailpost;
  };
}

module.exports = PostRepository;
