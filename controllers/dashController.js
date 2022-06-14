const Image = require("../models/imageModel");
const catchAsync = require("../utils/catchAsync");

exports.getStatisticsImages = catchAsync(async (req, res, next) => {
  const cleanImages = await Image.find({
    result: "accepted",
    annotatedBy: req.user.id,
  });
  const unCleanImages = await Image.find({
    result: "rejected",
    annotatedBy: req.user.id,
  });

  res.status(200).json({
    status: "success",
    lengthCleanImages: cleanImages.length,
    lengthUnCleanImages: unCleanImages.length,
  });
});
