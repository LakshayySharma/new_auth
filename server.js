const express = require("express");
require("dotenv").config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    msg: "setup done",
  });
});

app.listen(process.env.PORT, (req, res) => {
  console.log(`server started`);
});
