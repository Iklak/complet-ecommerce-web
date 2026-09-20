const express = require("express");
const protect = require("../middlewares/authMiddleware");
const { getProfile } = require("../controllers/user.controller");

const router = express.Router();

router.get("/profile", protect, getProfile);

module.exports = router;
