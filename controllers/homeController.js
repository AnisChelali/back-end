const catchAsync = require("./../utils/catchAsync");
const Image = require("./../models/imageModel");

exports.saveImages = catchAsync(async (req, res, next) => {
  //   const images = req.body;
  //   const isExist = await Image.find();
  //   if(isExist !== images)  await Image.deleteMany()
  // //   if (!isExist) await Image.create(el);
  //   res.status(201).json({
  //     status: "success",
  //   });
});

exports.changeImageStatus = catchAsync(async (req, res, next) => {
  //   const image = await Image.findOne({ url: req.body.url });
  //   await Image.findByIdAndUpdate(image.id, req.body, {
  //     new: true,
  //     runValidators: true,
  //   });
  const isExists = await Image.findOne({
    url: req.body.url,
    annotatedBy: req.user.id,
  });
  if (!isExists)
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
