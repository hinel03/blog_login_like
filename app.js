const express = require("express");
const cors = require("cors");
const connect = require("./schemas");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

connect();

const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const userRouter = require("./routes/users");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(postsRouter);
app.use(commentsRouter);
app.use(userRouter);



app.listen(port, () => {
    console.log(port, "포트로 서버가 연결됨");
});

