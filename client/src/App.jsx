import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import axios from "axios";

// 🔥 DRAGGABLE TASK
function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-white/20 p-3 rounded mb-2 cursor-grab"
    >
      <h4 className="font-semibold">{task.title}</h4>
      <p className="text-sm">{task.description}</p>
    </div>
  );
}

// 🔥 COLUMN
function Column({ title, status, tasks }) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-white/10 p-4 rounded w-72 min-h-[300px]"
    >
      <h2 className="text-lg font-bold mb-3">{title}</h2>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projectId, setProjectId] = useState("");

  const API = "http://localhost:5000/api";

  // 🔥 Load token
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // ================= LOGIN =================
  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setToken(res.data.token);
      setIsLoggedIn(true);

      alert("Login successful ✅");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed ❌");
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setTasks([]);
    setProjectId("");
  };

  // ================= CREATE PROJECT =================
  const createProject = async () => {
    try {
      const res = await axios.post(
        `${API}/projects/create`,
        { name: "My Project", description: "Demo" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjectId(res.data.id);
      alert("Project created ✅");
    } catch (err) {
      alert("Error creating project");
    }
  };

  // ================= CREATE TASK =================
  const createTask = async () => {
    try {
      await axios.post(
        `${API}/tasks/create`,
        {
          title: "New Task",
          description: "Demo task",
          projectId,
          status: "Todo", // 🔥 important
          dueDate: new Date(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      loadTasks();
    } catch (err) {
      alert("Error creating task");
    }
  };

  // ================= LOAD TASKS =================
  const loadTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(res.data);
    } catch (err) {
      alert("Error loading tasks");
    }
  };

  // 🔥 DRAG HANDLER
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    try {
      await axios.put(
        `${API}/tasks/${active.id}`,
        { status: over.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      loadTasks();
    } catch (err) {
      console.error("Drag update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex flex-col items-center p-6">

      <h1 className="text-4xl font-bold mb-6">🔥 Team Task Manager</h1>

      {!isLoggedIn ? (
        <div className="bg-white/20 p-6 rounded-xl w-80">
          <input
            className="w-full p-2 mb-2 text-black"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-2 mb-2 text-black"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login} className="bg-indigo-600 p-2 w-full">
            Login
          </button>
        </div>
      ) : (
        <>
          <p className="mb-4">
            Logged in as: <b>{role}</b>
          </p>

          <div className="flex gap-3 mb-6">

            {role === "Admin" && (
              <button onClick={createProject} className="bg-green-500 px-4 py-2 rounded">
                Create Project
              </button>
            )}

            {role === "Admin" && (
              <button onClick={createTask} className="bg-blue-500 px-4 py-2 rounded">
                Create Task
              </button>
            )}

            <button onClick={loadTasks} className="bg-gray-700 px-4 py-2 rounded">
              Load Tasks
            </button>

            <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
              Logout
            </button>
          </div>

          {/* 🔥 KANBAN BOARD */}
          <DndContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4">

              <Column
                title="Todo"
                status="Todo"
                tasks={tasks.filter((t) => t.status === "Todo")}
              />

              <Column
                title="In Progress"
                status="In Progress"
                tasks={tasks.filter((t) => t.status === "In Progress")}
              />

              <Column
                title="Done"
                status="Done"
                tasks={tasks.filter((t) => t.status === "Done")}
              />

            </div>
          </DndContext>
        </>
      )}
    </div>
  );
}

export default App;