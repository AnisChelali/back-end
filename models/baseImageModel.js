const mongoose = require("mongoose"); //type: mongoose.Types.ObjectId

const imageSchema = new mongoose.Schema({
  url: String,
});

const BaseImage = mongoose.model("Base", imageSchema);

module.exports = BaseImage;
