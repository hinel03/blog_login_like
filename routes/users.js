const express = require("express");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User } = require("../models");
const { LikePost } = require("../models");
const { Post } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

/*
 * 기능: 회원가입
 * API URL: /users
 * Method: POST 
 * 유저 정보 확인 후 데이터 베이스에 유저 아이디 생성 API
 * 유저 입력 값을 바디를 통해서 받음 ( nickname, password, confirmpassword ) 닉네임 비밀번호 비밀번호 확인
 * 비밀번호 불일치 시에 진행 불가
 * 닉네임 존재시에 진행 불가
 */

router.post("/users", async (req, res) => {

    const { nickname, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
        res.status(400).send({
            errorMessage: "비밀번호가 일치하지 않습니다.",
        });
        return;
    }

    const existUsers = await User.findAll({
        where: {
            [Op.or]: [{ nickname }]
        },
    });

    if (existUsers.length) {
        res.status(400).send({
            errorMessage: "이미 가입된 닉네임입니다",
        });
        return;
    }

    await User.create({ nickname, password });

    res.send(201).send({});

});

/*
 * 기능: 로그인
 * API URL: /login
 * Method: POST 
 * 유저 정보 확인 후 데이터 베이스에서 유저 정보 불러오는 API
 * 유저 입력 값을 바디를 통해서 받음 ( nickname, password) 닉네임 비밀번호 
 * 닉네임 혹은 비밀번호 틀릴 시에 진행 불가
 * 성공시에 토큰 발급 후에 쿠키에 저장
 */

router.post("/users/login", async (req, res) => {
    const { nickname, password } = req.body;
    const expires = new Date();

    expires.setMinutes(expires.getMinutes() + 60);

    const user = await User.findOne({ where: { nickname, password } });

    if (!user) {
        res.status(400).send({
            errorMessage: "아이디 또는 패스워드가 잘못됐습니다.",
        });
        return;
    }

    const token = jwt.sign({ userId: user.userId }, "secret-key");

    res.cookie('token', token, { expires: expires });

    console.log("로그인 완료");
    return res.status(200).end();
});

/*
 * 기능: 유저 정보 조회
 * API URL: /users/me
 * Method: GET 
 * 유저 정보 확인 후 데이터 베이스에 존재하는 유저 정보 불러오는 API
 * 로그인 필요
 */


router.get("/users/me", authMiddleware, async (req, res) => {
    const { user } = res.locals;

    res.status(200).send({
        user,
    });
});

/*
 * 기능: 유저가 좋아요 표시한 글 조회
 * API URL: /users/likes
 * Method: GET 
 * 유저 정보 확인 후 데이터 베이스에 존재하는 유저가 좋아요 표시한 글을 불러오는 API
 * 로그인 필요
 * 좋아요 한 글이 없을시 진행 불가
 * 
 */

router.get("/users/likes", authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const userId = user.userId;
        
    const likedposts = await LikePost.findAll({ order: [['updatedAt', 'DESC']], where: { userId }});
    
    if(likedposts.length){
       const likedpostId = likedposts.map(function(obj){
        const temp = obj.postId;
        console.log(temp);
        return temp;
       });

       const selectedPosts = await Post.findAll({ order: [['likes', 'DESC']], where: { postid:likedpostId }});

       res.json({
        selectedPosts,
    });
    }
    else{
        return res.status(400).json({ success: false, errorMessage: "좋아요를 표시한 글이 없습니다." });
    }
});

module.exports = router;