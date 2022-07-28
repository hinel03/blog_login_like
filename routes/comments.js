const express = require("express");
const Comments = require("../schemas/comments");
const Posts = require("../schemas/posts");
const { stringify } = require("querystring");
const router = express.Router();

router.get("/comments/:postId", async (req,res) => {
    const {postId} = req.params;
    
    const comments = await Comments.find({ postId: postId }).sort({ date: -1 });
    const encoded = [];

    for(i=0; i<comments.length; i++){
        encoded.push({
            commentId: comments[i]._id,
            user: comments[i].writerId,
            content: comments[i].content,
            createdAt: comments[i].date,
        });
    }
    res.json({
        encoded,
    });
});

router.post("/comments/:postId", async (req,res) => {
    const { writerId, password, content } = req.body;
    const {postId} = req.params; 
    const date = new Date();

    const [posts] = await Posts.find({_id: postId});

    if(posts) {
        const createdComments = await Comments.create({ writerId, password, content, date, postId });
    }
    else{
        return res.status(400).json({ success:false, errorMessage: "존재하지 않는 게시글입니다." });
    }
    

    res.json( "댓글을 생성하였습니다." );
});

router.put("/comments/:commentId", async (req,res) => {
    const { password, content } = req.body;
    const {commentId} = req.params; 

    const [comments] = await Comments.find({_id: commentId});
    
    if(comments) {
        if( !content ){
            return res.status(400).json({ success:false, errorMessage: "내용을 입력해주세요." });
        }
        else{
            if(password === comments.password){
                await Comments.updateOne({_id: commentId}, { $set: { content } });
            }
            else{
                return res.status(400).json({ success:false, errorMessage: "비밀번호가 다릅니다." });
            }
        }
        
    }
    
    res.json( "댓글을 수정하였습니다." );
});

router.delete("/comments/:commentId", async (req,res) => {
    const { password } = req.body;
    const {commentId} = req.params; 

    const [comments] = await Comments.find({_id: commentId});
    
    if(comments) {
        if( password === comments.password ){
            await Comments.deleteOne({ _id: commentId });
            console.log("삭제 완료");
        }
        else{
            return res.status(400).json({ success:false, errorMessage: "비밀번호가 다릅니다." });
        }
    }
    
    res.json( "댓글을 삭제하였습니다." );
});

module.exports = router;