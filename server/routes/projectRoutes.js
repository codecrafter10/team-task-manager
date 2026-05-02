const express = require("express");
const router = express.Router();

const { createProject, addMember } = require("../controllers/projectController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/create", verifyToken, createProject);
router.post("/add-member", verifyToken, addMember);

module.exports = router;