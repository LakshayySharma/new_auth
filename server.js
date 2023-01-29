const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoutes");
const cors = require("cors");
const db = require("./util/db");

db();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.json({
    msg: "setup done",
  });
});

app.listen(process.env.PORT, (req, res) => {
  console.log(`server started`);
});
