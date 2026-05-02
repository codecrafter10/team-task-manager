const db = require("../config/firebase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRef.add({
      name,
      email,
      password: hashedPassword,
      role: "Member", // default role
      createdAt: new Date()
    });

    res.status(201).json({
      msg: "User registered successfully",
      id: newUser.id
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ msg: "Error registering user" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email & password required" });
    }

    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({ msg: "User not found" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 🔥 TOKEN WITH ROLE
    const token = jwt.sign(
      {
        id: userDoc.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔥 Remove password before sending
    const { password: _, ...safeUser } = user;

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: userDoc.id,
        ...safeUser
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ msg: "Login error" });
  }
};