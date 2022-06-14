const express = require("express");

const authController = require("./../controllers/authController");
const dashController = require("./../controllers/dashController");

const router = express.Router();

module.exports = router;

router
  .route("/")
  .get(authController.protect, dashController.getStatisticsImages);
