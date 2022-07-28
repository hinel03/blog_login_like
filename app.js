const express = require("express");
const cors = require("cors");
const connect = require("./schemas");
const app = express();
const port = 3000;

connect();

const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

app.use(cors());
app.use(express.json());
app.use(postsRouter);
app.use(commentsRouter);

app.listen(port, () => {
    console.log(port, "포트로 서버가 연결됨");
});