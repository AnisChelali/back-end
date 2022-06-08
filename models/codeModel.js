const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  invitationCode: Number,
});

const Code = mongoose.model("Code", codeSchema);

module.exports = Code;
