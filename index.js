require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mainRouter = require("./routes/mainRouter");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 7124;
const uriDB =
  process.env.MONGOOSE_URI || "mongodb://127.0.0.1:27017/weelogistics";

const app = express();

async function main() {
  await mongoose
    .connect(uriDB)
    .then(() => {
      console.log("DB connected");
    })
    .catch((err) => {
      throw Error("Error Connecting to DB:\n" + err);
    });

  app.use(morgan("tiny"));
  app.use(cors());
  app.use(express.json());
  app.use(mainRouter);

  app.listen(PORT, () => {
    console.log("App running on port " + PORT);
    console.log("http://localhost:" + PORT);
  });
}

main();
