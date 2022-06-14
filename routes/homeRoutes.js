const express = require("express");

const homeController = require("./../controllers/homeController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/").get(authController.protect, homeController.getImages);
router
  .route("/annotation")
  .post(authController.protect, homeController.changeImageStatus);

router
  .route("/clean")
  .post(authController.protect, homeController.saveGroupImages);
router
  .route("/unclean")
  .post(authController.protect, homeController.saveGroupImages);

module.exports = router;
