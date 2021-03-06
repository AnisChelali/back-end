const express = require("express");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password", authController.resetPassword);

// router.post("/login",passport.authenticate(), authController.login);

module.exports = router;
