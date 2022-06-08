const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: String,
  result: String,
  annotatedBy: mongoose.Types.ObjectId,
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
