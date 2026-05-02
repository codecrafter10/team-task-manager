const db = require("../config/firebase");

// ================= CREATE TASK =================
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    const task = await db.collection("tasks").add({
      title,
      description,
      projectId,
      assignedTo,
      status: "Pending",
      createdBy: req.user.id,
      dueDate: new Date(dueDate),
      createdAt: new Date()
    });

    res.json({
      msg: "Task created",
      id: task.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating task" });
  }
};


// ================= GET TASKS =================
exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const snapshot = await db
      .collection("tasks")
      .where("projectId", "==", projectId)
      .get();

    const tasks = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      tasks.push({
        id: doc.id,
        ...data,
        dueDate: data.dueDate?.toDate(),
        createdAt: data.createdAt?.toDate()
      });
    });

    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching tasks" });
  }
};
// ================= UPDATE TASK STATUS =================
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    await db.collection("tasks").doc(taskId).update({
      status
    });

    res.json({ msg: "Task status updated" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating task" });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    await db.collection("tasks").doc(taskId).delete();

    res.json({ msg: "Task deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deleting task" });
  }
};

// TASK STATS
exports.getTaskStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    const snapshot = await db
      .collection("tasks")
      .where("projectId", "==", projectId)
      .get();

    let total = 0;
    let pending = 0;
    let done = 0;

    snapshot.forEach(doc => {
      total++;

      const task = doc.data();
      if (task.status === "Pending") pending++;
      if (task.status === "Done") done++;
    });

    res.json({ total, pending, done });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching stats" });
  }
};