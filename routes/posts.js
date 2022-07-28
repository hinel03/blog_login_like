const express = require("express");
const Posts = require("../schemas/posts")
const { stringify } = require("querystring");
const router = express.Router();


router.get("/posts", async (req,res) => {
    const posts = await Posts.find().sort({ date: -1 });
    const encoded = [];

    for( i=0; i<posts.length; i++){
        encoded.push({
            postId: posts[i]._id.toString(),
            user: posts[i].writerId,
            title: posts[i].title,
            createdAt: posts[i].date,
        });
    }

    res.json({
        encoded,
    });
});

router.get("/posts/:postId", async (req,res) => {
    const {postId} = req.params;
    const posts = await Posts.find().sort({ date: -1 });
    
    const [detail] = posts.filter((post) => post._id.toString() === postId);
    const encoded = [];

    encoded.push({
        postId: detail._id.toString(),
        user: detail.writerId,
        title: detail.title,
        createdAt: detail.date,
    });

    res.json({
        encoded,
    });
});

router.put("/posts/:postId", async (req,res) => {
    const { password, title, content } = req.body;
    const {postId} = req.params; 

    const [posts] = await Posts.find({_id: postId});
    
    if(posts) {
        if( !title || !content ){
            return res.status(400).json({ success:false, errorMessage: "제목과 내용을 확인해주세요." });
        }
        else{
            if(password === posts.password){
                await Posts.updateOne({_id: postId}, { $set: { title, content } });
            }
            else{
                return res.status(400).json({ success:false, errorMessage: "비밀번호가 다릅니다." });
            }
        }
        
    }
    
    res.json( "게시글을 수정하였습니다." );
});


router.post("/posts", async (req,res) => {
    const { writerId, password, title, content } = req.body;
    const date = new Date();

    const posts = await Posts.find({ writerId });
    if(posts.length) {
        return res.status(400).json({ success:false, errorMessage: "이미 작성된 글입니다." });
    }

    const createdPosts = await Posts.create({ writerId, password, title, content, date });

    res.json( "게시글을 생성하였습니다." );
});

router.delete("/posts/:postId", async (req,res) => {
    const { password } = req.body;
    const {postId} = req.params; 

    const [posts] = await Posts.find({_id: postId});
    
    if(posts) {
        if( password === posts.password ){
            await Posts.deleteOne({ _id: postId });
            console.log("삭제 완료");
        }
        else{
            return res.status(400).json({ success:false, errorMessage: "비밀번호가 다릅니다." });
        }
    }
    
    res.json( "게시글을 삭제하였습니다." );
});



module.exports = router;