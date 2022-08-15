const UserService = require("../services/users.service");
const jwt = require("jsonwebtoken");

class UserController {
  userService = new UserService();

  createUser = async (req, res, next) => {
    const { nickname, password, confirmpassword } = req.body;
    const user = await this.userService.createUser(
      nickname,
      password,
      confirmpassword
    );

    res.status(201).json({ data: user });
  };

  userLogin = async (req, res, next) => {
    const { nickname, password } = req.body;
    const expires = new Date();
    const user = await this.userService.userLogin(nickname, password);

    const token = jwt.sign({ userId: user.userId }, "secret-key");
    expires.setMinutes(expires.getMinutes() + 60);

    res.cookie("token", token, { expires: expires });

    res.status(200).json("로그인 성공");
  };

  findUser = async (req, res, next) => {
    const { user } = res.locals;

    const userinfo = await this.userService.findUser(
      user.nickname,
      user.password
    );

    res.status(200).json({ data: userinfo });
  };

  findUserLikes = async (req, res, next) => {
    const { user } = res.locals;

    const userlike = await this.userService.findUserLikes(user.userId);

    res.status(200).json({ data: userlike });
  };
}

module.exports = UserController;
