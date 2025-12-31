import express from "express";
const app = express();

// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
let x = 1;

app.get("/", (req, res) => {
  res.json({
    msg: "Hi there",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
