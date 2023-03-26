const express = require("express");
const path = require("path");
const router = express.Router();

const rootDir = path.resolve(__dirname, "../");

router.use(express.static(path.join(rootDir, "public")));

router.all("*", (req, res) => {
  res.status(404).sendFile(path.join(rootDir, "public", "404.html"));
});

module.exports = router;
