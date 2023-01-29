const express = require("express");
const app = express();

app.use(express.json());

app.listen(8080, (req, res) => {
  console.log(`server started`);
});
