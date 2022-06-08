const express = require("express");

const homeController = require("./../controllers/homeController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/").post(authController.protect, homeController.saveImages);

module.exports = router;
