const express = require("express");
const { Post } = require("../models");
const { LikePost } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const { NUMBER } = require("sequelize");
const router = express.Router();

/*
 * 기능: 게시글 조회
 * API URL: /posts
 * Method: GET
 * 데이터 베이스 내에 있는 모든 글들을 불러오는 API
 * 로그인 없이도 사용 가능
 */

router.get("/posts", async (req, res) => {
  const posts = await Post.findAll({ order: [["createdAt", "DESC"]] });

  res.json({
    posts,
  });
});

/*
 * 기능: 특정 게시글 조회
 * API URL: /posts/:postId
 * Method: GET
 * 데이터 베이스 내에 있는 특정 글을 불러오는 API
 * 로그인 없이도 사용 가능
 * 유저 입력 url에서 해당 글에 아이디를 받아와서 찾는 방식 (postId)
 */

router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  Number(postId);
  const detailpost = await Post.findOne({
    order: [["createdAt", "DESC"]],
    where: { postId },
  });

  res.json({
    detailpost,
  });
});

/*
 * 기능: 게시글 수정
 * API URL: /posts/:postId
 * Method: PUT
 * 데이터 베이스 내에 있는 특정 글을 수정하는 API
 * 로그인 필요
 * 유저 입력 url에서 해당 글에 아이디를 받아와서 찾는 방식 (postId)
 * 유저 입력 값을 바디를 통해서 받음 ( password, title, content ) 비번 제목 내용
 * 해당 글이 없을시에 진행 불가
 * 제목 혹은 내용 없을 시에 진행 불가
 * 유저 입력 비밀번호와 로그인 된 아이디 비밀번호 다를 시에 진행 불가
 */

router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { password, title, content } = req.body;
  const { postId } = req.params;
  const { user } = res.locals;

  const detailpost = await Post.findOne({ where: { postId } });

  if (detailpost) {
    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "제목과 내용을 확인해주세요." });
    } else {
      if (password.toString() === user.password) {
        await Post.update(
          { title: title, content: content },
          { where: { postId } }
        );
      } else {
        return res
          .status(400)
          .json({ success: false, errorMessage: "비밀번호가 다릅니다." });
      }
    }
  } else {
    return res
      .status(400)
      .json({ success: false, errorMessage: "해당 글이 존재하지 않습니다." });
  }

  res.status(200).json("게시글을 수정하였습니다.");
});

/*
 * 기능: 게시글 작성
 * API URL: /posts
 * Method: POST
 * 게시글 작성 이후에 데이터 베이스에 넣는 API
 * 로그인 필요
 * 유저 입력 값을 바디를 통해서 받음 ( title, content ) 제목 내용
 * 제목 혹은 내용 없을 시에 진행 불가
 */

router.post("/posts", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const { user } = res.locals;
  const nickname = user.nickname;
  const likes = 0;

  if (!title || !content) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "제목과 내용을 확인해주세요." });
  } else {
    await Post.create({ nickname, title, content, likes });
  }

  res.send(201).send({});
});

/*
 * 기능: 게시글 삭제
 * API URL: /posts/:postId
 * Method: DELETE
 * 데이터 베이스 내에 있는 게시글을 삭제하는 API
 * 로그인 필요
 * 유저 입력 url에서 해당 글에 아이디를 받아와서 찾는 방식 (postId)
 * 유저 입력 값을 바디를 통해서 받음 ( password ) 비밀번호
 * 해당 글이 없을 시에 진행 불가
 * 유저 입력 비밀번호와 로그인 된 아이디 비밀번호 다를 시에 진행 불가
 */

router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { password } = req.body;
  const { postId } = req.params;
  const { user } = res.locals;

  const detailpost = await Post.findOne({ where: { postId } });

  if (detailpost) {
    if (password.toString() === user.password) {
      await Post.destroy({ where: { postId: postId } });
    } else {
      return res
        .status(400)
        .json({ success: false, errorMessage: "비밀번호가 다릅니다." });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, errorMessage: "해당 글이 존재하지 않습니다." });
  }

  res.status(200).json("게시글을 삭제하였습니다.");
});

/*
 * 기능: 게시글에 좋아요 표시
 * API URL: /posts/like/:postId
 * Method: POST
 * 데이터 베이스 내에 있는 게시글에 좋아요를 표시하는 API
 * 로그인 필요
 * 유저 입력 url에서 해당 글에 아이디를 받아와서 찾는 방식 (postId)
 * 해당 글이 없을 시에 진행 불가
 * 좋아요 한 글이 이미 존재 시에 진행 불가
 */

router.post("/posts/like/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { user } = res.locals;
  const userId = user.userId;

  const detailpost = await Post.findOne({ where: { postId } });
  const likesaved = detailpost.likes;
  const likedpost = await LikePost.findOne({ where: { postId, userId } });

  if (detailpost) {
    if (!likedpost) {
      await Post.update({ likes: likesaved + 1 }, { where: { postId } });
      const result = await LikePost.create({ userId, postId });
    } else {
      return res
        .status(400)
        .json({ success: false, errorMessage: "이미 좋아요를 눌렀습니다." });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, errorMessage: "해당 글이 존재하지 않습니다." });
  }

  res.send(201).send({});
});

/*
 * 기능: 게시글에 좋아요 표시 해제
 * API URL: /posts/dislike/:postId
 * Method: DELETE
 * 데이터 베이스 내에 있는 게시글에 좋아요를 표시를 해제하는 API
 * 로그인 필요
 * 유저 입력 url에서 해당 글에 아이디를 받아와서 찾는 방식 (postId)
 * 해당 글이 없을 시에 진행 불가
 * 좋아요 한 글이 없을 시에 진행 불가
 */

router.delete("/posts/dislike/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { user } = res.locals;
  const userId = user.userId;

  const detailpost = await Post.findOne({ where: { postId } });
  const likesaved = detailpost.likes;
  const likedpost = await LikePost.findOne({ where: { postId, userId } });

  if (detailpost) {
    if (likedpost) {
      await LikePost.destroy({ where: { userId: userId, postId: postId } });
      await Post.update({ likes: likesaved - 1 }, { where: { postId } });
    } else {
      return res
        .status(400)
        .json({ success: false, errorMessage: "좋아요를 누르지 않았습니다." });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, errorMessage: "해당 글이 존재하지 않습니다." });
  }

  res.status(200).json("좋아요를 취소하였습니다.");
});

module.exports = router;
