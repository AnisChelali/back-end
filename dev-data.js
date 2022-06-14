const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const BaseImage = require("./models/baseImageModel");
const Image = require("./models/imageModel");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE_REMOTE.replace(
  "<PASSWORD>",
  process.env.ATLAS_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, { to connect locally
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("db connection successful!"));

//get IMAGES from EXTERN API
const getImagesAPI = async () => {
  let images = [];
  await fetch("https://api.farmy.ai/api/v1/anomalies/history/", {
    method: "GET",
    headers: {
      authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjU0OTU3NzI4LCJqdGkiOiI1ZjdmODI3YzkzMmI0NWYzYjVlZDJiMTdmZTJkNjBhNCIsInVzZXJfaWQiOjl9.G0lfjTd2S3jLyeuGCDrdYBZiBpEltTA0opU_Wv97-RQ",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((el) => {
        el.images.forEach((e) => {
          images.push({
            url: e.image.full_size,
          });
        });
      });
    })
    .catch((err) => console.log(err));

  fs.writeFile(
    `${__dirname}/images-dc.json`,
    JSON.stringify(images),
    "utf-8",
    () => {
      console.log("done");
    }
  );
};

//READ JSON FILE
const images = JSON.parse(
  fs.readFileSync(`${__dirname}/images-dc.json`, "utf-8")
);
//IMPORT DATA TO DATABASE
const importData = async () => {
  try {
    // const check = await BaseImage.find();
    // if (check)
    await Image.deleteMany();
    // await Image.create(images); //accept array of objects
    console.log("data successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// getImagesAPI();
importData();
