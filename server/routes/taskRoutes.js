const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// CREATE → Admin only
router.post(
  "/create",
  verifyToken,
  allowRoles("Admin"),
  taskController.createTask
);

// STATS
router.get(
  "/stats/:projectId",
  verifyToken,
  allowRoles("Admin", "Member"),
  taskController.getTaskStats
);

// GET TASKS
router.get(
  "/:projectId",
  verifyToken,
  allowRoles("Admin", "Member"),
  taskController.getTasks
);

// UPDATE
router.put(
  "/:taskId",
  verifyToken,
  allowRoles("Admin", "Member"),
  taskController.updateTaskStatus
);

// DELETE → Admin only
router.delete(
  "/:taskId",
  verifyToken,
  allowRoles("Admin"),
  taskController.deleteTask
);

module.exports = router;