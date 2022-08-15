const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3006;

const rotuer = require("./routes");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/", rotuer);

app.listen(port, () => {
  console.log(port, "포트로 서버가 연결됨");
});
