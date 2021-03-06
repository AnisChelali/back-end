const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

const DB = process.env.DATABASE_REMOTE.replace(
  "<PASSWORD>",
  process.env.ATLAS_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("db connected successfully!"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTIONS! shutting down....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
