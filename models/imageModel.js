const mongoose = require("mongoose"); //type: mongoose.Types.ObjectId

const imageSchema = new mongoose.Schema({
  url: String,
  result: { type: String, default: "default" },
  annotatedBy: { type: mongoose.Types.ObjectId },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
