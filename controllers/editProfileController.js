const Image = require("../models/imageModel");
const catchAsync = require("../utils/catchAsync");

exports.getHistoryImages = catchAsync(async (req, res, next) => {
  const url = req.url.split("/");
  let cleanImages;
  if (url[2] === "clean") {
    cleanImages = await Image.find({
      result: "accepted",
      annotatedBy: req.user.id,
    });
  } else {
    cleanImages = await Image.find({
      result: "rejected",
      annotatedBy: req.user.id,
    });
  }
  if (!cleanImages) cleanImages = [];

  res.status(200).json({
    status: "success",
    data: cleanImages,
  });
});
