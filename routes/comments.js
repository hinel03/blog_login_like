const express = require("express");
const { Comment } = require("../models");
const { Post } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

/*
 * 기능: 댓글 조회
 * API URL: /comments
 * Method: GET
 * 데이터 베이스 내에 존재하는 댓글들을 불러오는 API
 * 로그인 없이도 사용 가능
 */

router.get("/comments", async (req, res) => {
  const comments = await Comment.findAll({ order: [["createdAt", "DESC"]] });

  res.json({
    comments,
  });
});

/*
 * 기능: 특정 글의 댓글 조회
 * API URL: /comments/:postId
 * Method: GET
 * 데이터 베이스 내에 존재하는 해당 글의 댓글들을 불러오는 API
 * 로그인 없이도 사용 가능
 */

router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.findAll({
    where: { postId },
    order: [["createdAt", "DESC"]],
  });

  res.json({
    comments,
  });
});

/*
 * 기능: 댓글 작성
 * API URL: /comments/:postId
 * Method: POST
 * 데이터 베이스 내에 존재하는 해당 글에 댓글을 작성/저장하는 API
 * 로그인 필요
 * 해당 글이 존재하지 않을 시에 진행 불가
 * 유저 입력 url에서 해당 글에 아이디를 받아와서 찾는 방식 (postId)
 * 유저 입력 값을 body를 통해서 받음 ( content ) 내용
 */

router.post("/comments/:postId", authMiddleware, async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;
  const { user } = res.locals;
  const nickname = user.nickname;

  const detailpost = await Post.findOne({ where: { postId } });

  if (detailpost) {
    await Comment.create({ nickname, content, postId });
  } else {
    return res
      .status(400)
      .json({ success: false, errorMessage: "존재하지 않는 게시글입니다." });
  }

  res.send(201).send({});
});

/*
 * 기능: 댓글 수정
 * API URL: /comments/:commentId
 * Method: PUT
 * 데이터 베이스 내에 존재하는 해당 댓글을 수정하는 API
 * 로그인 필요
 * 해당 댓글이 존재하지 않을 시에 진행 불가
 * 유저 입력 url에서 해당 댓글에 아이디를 받아와서 찾는 방식 ( commentId )
 * 유저 입력 값을 body를 통해서 받음 ( content ) 내용
 * 내용 없을 시에 진행 불가
 * 유저 입력 비밀번호와 로그인 된 아이디 비밀번호 다를 시에 진행 불가
 */

router.put("/comments/:commentId", authMiddleware, async (req, res) => {
  const { password, content } = req.body;
  const { user } = res.locals;
  const { commentId } = req.params;

  const selectedComment = await Comment.findOne({ where: { commentId } });

  if (selectedComment) {
    if (!content) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "내용을 입력해주세요." });
    } else {
      if (password.toString() === user.password) {
        await Comment.update({ content: content }, { where: { commentId } });
      } else {
        return res
          .status(400)
          .json({ success: false, errorMessage: "비밀번호가 다릅니다." });
      }
    }
  } else {
    return res
      .status(400)
      .json({ success: false, errorMessage: "존재하지 않는 댓글입니다." });
  }

  res.status(200).json("댓글을 수정하였습니다.");
});

/*
 * 기능: 댓글 삭제
 * API URL: /comments/:commentId
 * Method: DELETE
 * 데이터 베이스 내에 존재하는 해당 댓글을 삭제하는 API
 * 로그인 필요
 * 해당 댓글이 존재하지 않을 시에 진행 불가
 * 유저 입력 url에서 해당 댓글에 아이디를 받아와서 찾는 방식 ( commentId )
 * 유저 입력 값을 body를 통해서 받음 ( password )비밀번호
 * 유저 입력 비밀번호와 로그인 된 아이디 비밀번호 다를 시에 진행 불가
 */

router.delete("/comments/:commentId", authMiddleware, async (req, res) => {
  const { password } = req.body;
  const { commentId } = req.params;
  const { user } = res.locals;

  const selectedComment = await Comment.findOne({ commentId });

  if (selectedComment) {
    if (password.toString() === user.password) {
      await Comment.destroy({ where: { commentId: commentId } });
    } else {
      return res
        .status(400)
        .json({ success: false, errorMessage: "비밀번호가 다릅니다." });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, errorMessage: "존재하지 않는 댓글입니다." });
  }

  res.status(200).json("댓글을 삭제하였습니다.");
});

module.exports = router;
