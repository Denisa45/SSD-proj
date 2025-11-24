import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { Pool } = pkg;

const app = express();
const PORT = 5000;

// =============================
// 🔹 PostgreSQL Connection
// =============================
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "StudyPlanner",
  password: "andrei4590",
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = "supersecret123";


// REGISTER
app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // verificăm dacă userul există
    const existing = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashed]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("REGISTER error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// LOGIN
app.post("/auth/login", async (req, res) => {
  const { identifier, password } = req.body;  
  // identifier = username OR email

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $1",
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // if password stored as null (Google accounts)
    if (!user.password) {
      return res.status(400).json({ error: "This account uses Google Login" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("LOGIN error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}


// =============================
// 🔹 GOOGLE LOGIN
// =============================
app.post("/auth/google", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    // Check if user exists
    let result = await pool.query("SELECT * FROM users WHERE username = $1", [email]);

    let user;

    if (result.rows.length === 0) {
      // Create new Google user
      result = await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
        [email, null] // No password for Google accounts
      );
    }

    user = result.rows[0];

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);
    res.status(500).json({ error: "Google login failed" });
  }
});


// =======================================================
//  🔹 COURSES CRUD (NO userId REQUIRED)
// =======================================================

// GET all courses
app.get("/courses", auth, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM courses WHERE userid = $1 ORDER BY id",
    [req.user.userId]
  );
  res.json(result.rows);
});

app.post("/courses", auth, async (req, res) => {
  const { name, description } = req.body;

  console.log("📥 POST /courses received:", req.body);
  console.log("👤 User from token:", req.user);

  try {
    const result = await pool.query(
      "INSERT INTO courses (name, description, userid) VALUES ($1, $2, $3) RETURNING *",
      [name, description, req.user.userId]
    );

    console.log("✅ Course added:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ POST /courses ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// DELETE a course
app.delete("/courses/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query("DELETE FROM courses WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("DELETE /courses/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// =======================================================
//  🔹 EVENTS CRUD
// =======================================================

// GET all events
app.get("/api/events", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY date ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/events error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// GET one event
app.get("/api/events/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET /api/events/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// POST add event
app.post("/api/events", async (req, res) => {
  const { title, date } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO events (title, date) VALUES ($1, $2) RETURNING *",
      [title, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /api/events error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE event (description/title/date)
app.patch("/api/events/:id", async (req, res) => {
  const id = req.params.id;
  const { title, date, description } = req.body;

  try {
    const updated = await pool.query(
      `UPDATE events 
       SET title = COALESCE($1, title), 
           date = COALESCE($2, date),
           description = COALESCE($3, description)
       WHERE id = $4
       RETURNING *`,
      [title, date, description, id]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error("PATCH /api/events/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// DELETE event
app.delete("/api/events/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query("DELETE FROM events WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("DELETE /api/events/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// =======================================================
//  START SERVER
// =======================================================

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);



// GET one course by ID
app.get("/courses/:id", auth, async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      "SELECT * FROM courses WHERE id = $1 AND userid = $2",
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Parse JSON fields safely
const course = result.rows[0];

course.tasks = Array.isArray(course.tasks)
  ? course.tasks
  : JSON.parse(course.tasks || "[]");

course.materials = Array.isArray(course.materials)
  ? course.materials
  : JSON.parse(course.materials || "[]");

course.grades = Array.isArray(course.grades)
  ? course.grades
  : JSON.parse(course.grades || "[]");

res.json(course);

  } catch (err) {
    console.error("GET /courses/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});



//add task
app.post("/courses/:id/tasks", auth, async (req, res) => {
  const courseId = req.params.id;
  const { task } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM courses WHERE id = $1 AND userid = $2",
      [courseId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const course = result.rows[0];
    let tasks = course.tasks || [];

    // prevent duplicate task names
    if (tasks.some(t => t.name === task)) {
      return res.status(400).json({ error: "Task already exists" });
    }

    tasks.push({ name: task, done: false });

    const updated = await pool.query(
      "UPDATE courses SET tasks = $1 WHERE id = $2 RETURNING *",
      [JSON.stringify(tasks), courseId]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error("❌ Error adding task:", err);
    res.status(500).json({ error: "Server error" });
  }
});



//toggle task

app.patch("/courses/:id/tasks/:taskName/toggle", auth, async (req, res) => {
  const { id, taskName } = req.params;

  try {
    const result = await pool.query(
      "SELECT tasks FROM courses WHERE id = $1 AND userid = $2",
      [id, req.user.userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Course not found" });

    // FIX: Parse JSON correctly
    let tasks = Array.isArray(result.rows[0].tasks)
      ? result.rows[0].tasks
      : JSON.parse(result.rows[0].tasks || "[]");

    // Toggle done
    tasks = tasks.map(t =>
      t.name === taskName ? { ...t, done: !t.done } : t
    );

    const updated = await pool.query(
      "UPDATE courses SET tasks = $1 WHERE id = $2 RETURNING *",
      [JSON.stringify(tasks), id]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error("❌ Toggle error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// REMOVE a task
app.post("/courses/:id/tasks/remove", auth, async (req, res) => {
  const courseId = req.params.id;
  const { name } = req.body;

  try {
    const result = await pool.query(
      "SELECT tasks FROM courses WHERE id = $1 AND userid = $2",
      [courseId, req.user.userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Course not found" });

    // FIX: Parse JSON if needed
    let tasks = Array.isArray(result.rows[0].tasks)
      ? result.rows[0].tasks
      : JSON.parse(result.rows[0].tasks || "[]");

    const updatedTasks = tasks.filter(t => t.name !== name);

    const updateResult = await pool.query(
      "UPDATE courses SET tasks = $1 WHERE id = $2 RETURNING *",
      [JSON.stringify(updatedTasks), courseId]
    );

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error("❌ REMOVE TASK ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});




//add grade 
app.post("/courses/:id/grades", auth, async (req, res) => {
  const courseId = req.params.id;
  const { grade } = req.body;  // number

  try {
    const result = await pool.query(
      "SELECT grades FROM courses WHERE id = $1 AND userid = $2",
      [courseId, req.user.userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Course not found" });

    let grades = Array.isArray(result.rows[0].grades)
      ? result.rows[0].grades
      : JSON.parse(result.rows[0].grades || "[]");

    grades.push({ value: Number(grade) });

    const update = await pool.query(
      "UPDATE courses SET grades = $1 WHERE id = $2 RETURNING *",
      [JSON.stringify(grades), courseId]
    );

    res.json(update.rows[0]);
  } catch (err) {
    console.error("❌ Error adding grade:", err);
    res.status(500).json({ error: "Server error" });
  }
});



//remove grade
app.post("/courses/:id/grades/remove", auth, async (req, res) => {
  const courseId = req.params.id;
  const { index } = req.body;

  try {
    const result = await pool.query(
      "SELECT grades FROM courses WHERE id = $1 AND userid = $2",
      [courseId, req.user.userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Course not found" });

    let grades = Array.isArray(result.rows[0].grades)
      ? result.rows[0].grades
      : JSON.parse(result.rows[0].grades || "[]");

    grades.splice(index, 1); // remove grade by index

    const update = await pool.query(
      "UPDATE courses SET grades = $1 WHERE id = $2 RETURNING *",
      [JSON.stringify(grades), courseId]
    );

    res.json(update.rows[0]);
  } catch (err) {
    console.error("❌ Error removing grade:", err);
    res.status(500).json({ error: "Server error" });
  }
});


//update username
app.patch("/auth/update-username", auth, async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username",
      [username, req.user.userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE USERNAME error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


//update email
app.patch("/auth/update-email", auth, async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ error: "Email required" });

  try {
    await pool.query(
      "UPDATE users SET email = $1 WHERE id = $2",
      [email, req.user.userId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("UPDATE EMAIL error:", err);
    res.status(500).json({ error: "Database error" });
  }
});




//update password
app.patch("/auth/update-password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Missing password fields" });
  }

  try {
    // get current password hash
    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // compare old password
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ error: "Wrong current password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashed, req.user.userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE PASSWORD error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

