const express = require("express");
const homeController = require("./../controllers/homeController");
const authController = require("./../controllers/authController");

const router = express.Router();

// router.route("/annotation").patch(homeController.changeImageStatus);
router
  .route("/annotation")
  .post(authController.protect, homeController.changeImageStatus);

module.exports = router;
