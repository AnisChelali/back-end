const catchAsync = require("./../utils/catchAsync");
const Image = require("./../models/imageModel");
const BaseImage = require("../models/baseImageModel");

exports.changeImageStatus = catchAsync(async (req, res, next) => {
  const isExists = await Image.findOne({
    url: req.body.url,
    annotatedBy: req.user.id,
  });
  if (!isExists)
    // return next(new appError("this image does not exists anymore", 404));
    await Image.create({
      ...req.body,
      annotatedBy: req.user.id,
    });
  else
    await Image.findByIdAndUpdate(
      isExists.id,
      {
        ...req.body,
        annotatedBy: req.user.id,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  res.status(200).json({
    status: "success",
  });
});

exports.getImages = catchAsync(async (req, res, next) => {
  let query = [...(await BaseImage.find())];
  const imageCurrentUser = await Image.find({ annotatedBy: req.user.id });
  let newQuery = [];

  for (let i = 0; i < query.length; i++) {
    let isUsed = false;
    for (let j = 0; j < imageCurrentUser.length; j++) {
      if (query[i].url === imageCurrentUser[j].url) {
        isUsed = true;
      }
    }
    if (!isUsed) newQuery.push(query[i]);
  }

  const page = req.query.page * 1 || 1;
  const skip = (page - 1) * 20;
  const limit = page * 20;
  let images = [];

  for (let i = skip; i < limit; i++) {
    images.push(newQuery[i]);
  }

  res.status(200).json({
    status: "success",
    allImagesLength: newQuery.length,
    length: images.length,
    data: images,
  });
});

exports.saveGroupImages = catchAsync(async (req, res, next) => {
  const url = req.url.split("/");
  const images = req.body;
  if (url[1] === "clean") {
    for (let i = 0; i < images.length; i++) {
      await Image.create({
        url: images[i].url,
        result: "accepted",
        annotatedBy: req.user.id,
      });
    }
  }
  if (url[1] === "unclean") {
    for (let i = 0; i < images.length; i++) {
      await Image.create({
        url: images[i].url,
        result: "rejected",
        annotatedBy: req.user.id,
      });
    }
  }

  res.status(200).json({
    status: "success",
  });
});
