const { User } = require("../models");
const { LikePost } = require("../models");
const { Post } = require("../models");
const { Op } = require("sequelize");

class UserRepository {
  createUser = async (nickname, password) => {
    const existUsers = await User.findAll({
      where: {
        [Op.or]: [{ nickname }],
      },
    });

    if (existUsers.length) throw new Error("nickname in use");

    const createUserData = await User.create({
      nickname,
      password,
    });

    return createUserData;
  };

  login = async (nickname, password) => {
    const user = await User.findOne({ where: { nickname, password } });

    return user;
  };

  findUser = async (nickname, password) => {
    const findUserData = await User.findOne({ where: { nickname, password } });

    return findUserData;
  };

  findUserLikes = async (userId) => {
    const likedposts = await LikePost.findAll({
      order: [["updatedAt", "DESC"]],
      where: { userId },
    });

    if (likedposts.length) {
      const likedpostId = likedposts.map(function (obj) {
        const temp = obj.postId;
        console.log(temp);
        return temp;
      });
      const selectedPosts = await Post.findAll({
        order: [["likes", "DESC"]],
        where: { postid: likedpostId },
      });
      return selectedPosts;
    } else {
      throw new Error("No data exist");
    }
  };
}

module.exports = UserRepository;
