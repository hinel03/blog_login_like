const UserRepository = require("../repositories/users.repository");

class UserService {
  userRepository = new UserRepository();

  createUser = async (nickname, password, confirmpassword) => {
    if (password !== confirmpassword) throw new Error("Information Error");

    const createUserData = await this.userRepository.createUser(
      nickname,
      password
    );

    return {
      userId: createUserData.null,
      nickname: createUserData.nickname,
      password: createUserData.null,
      createdAt: createUserData.createdAt,
      updatedAt: createUserData.updatedAt,
    };
  };

  userLogin = async (nickname, password) => {
    const userData = await this.userRepository.login(nickname, password);

    if (!userData) throw new Error("User deosn't exist");

    return {
      userId: userData.userId,
      nickname: userData.nickname,
      password: userData.null,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
  };

  findUser = async (nickname, password) => {
    const findUser = await this.userRepository.findUser(nickname, password);

    return {
      userId: findUser.null,
      nickname: findUser.nickname,
      password: findUser.null,
      createdAt: findUser.createdAt,
      updatedAt: findUser.updatedAt,
    };
  };

  findUserLikes = async (userId) => {
    const findUserLikeData = await this.userRepository.findUserLikes(userId);

    if (!findUserLikeData) throw new Error("Data deosn't exist");

    return findUserLikeData;
  };
}

module.exports = UserService;
