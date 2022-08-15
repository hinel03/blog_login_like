const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  console.log("미들웨어 들어옴");
  console.log(token);

  if (!token) {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요.",
    });
    return;
  }

  try {
    const { userId } = jwt.verify(token, "secret-key");

    User.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    res.status(401).send({
      errorMessage: "정보를 확인하세요.",
    });
    return;
  }
};
