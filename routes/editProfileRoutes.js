const express = require("express");
const editProfileController = require("./../controllers/editProfileController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/history/clean")
  .get(authController.protect, editProfileController.getHistoryImages);
router
  .route("/history/unclean")
  .get(authController.protect, editProfileController.getHistoryImages);

router
  .route("/edit-profile")
  .post(authController.protect, authController.updateProfile);
module.exports = router;
