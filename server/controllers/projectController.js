const db = require("../config/firebase");
const admin = require("firebase-admin");

// ================= CREATE PROJECT =================
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await db.collection("projects").add({
      name,
      description,
      owner: req.user.id,
      members: [req.user.id],
      createdAt: new Date()
    });

    res.json({
      msg: "Project created",
      id: project.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating project" });
  }
};


// ================= ADD MEMBER =================
exports.addMember = async (req, res) => {
  try {
    // 🔥 DEBUG START
    const projects = await db.collection("projects").get();

    console.log("----- ALL PROJECTS IN DB -----");
    projects.forEach(doc => {
      console.log("Project in DB:", doc.id);
    });
    console.log("----- END -----");
    // 🔥 DEBUG END

    const { projectId, userId } = req.body;

    console.log("Received projectId:", projectId);

    const projectRef = db.collection("projects").doc(projectId);
    const doc = await projectRef.get();

    console.log("Doc exists:", doc.exists);

    if (!doc.exists) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const projectData = doc.data();

    if (projectData.members.includes(userId)) {
      return res.json({ msg: "User already a member" });
    }

    const updatedMembers = [...projectData.members, userId];

    await projectRef.update({
      members: updatedMembers
    });

    res.json({ msg: "Member added successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error adding member" });
  }
};