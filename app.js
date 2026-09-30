const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, "courses.json");

app.use(cors());
app.use(express.json());

// Helper: Ensure storage file exists
async function initStorage() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

// Helper: Read courses
async function readCourses() {
  const data = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(data);
}

// Helper: Write courses
async function writeCourses(courses) {
  await fs.writeFile(DATA_FILE, JSON.stringify(courses, null, 2), "utf8");
}

const VALID_STATUSES = ["Not Started", "In Progress", "Completed"];

// --- ENDPOINTS ---

// GET /api/courses - Get all
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await readCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to read courses file" });
  }
});

// GET /api/courses/:id - Get specific course
app.get("/api/courses/:id", async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const courses = await readCourses();
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      return res
        .status(404)
        .json({ error: `Course with ID ${courseId} not found` });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve course" });
  }
});

// POST /api/courses - Add course
app.post("/api/courses", async (req, res) => {
  try {
    const { name, description, target_date, status } = req.body;
    if (!name || !description || !target_date) {
      return res.status(400).json({
        error: "Missing required fields (name, description, target_date)",
      });
    }

    let courseStatus = status || "Not Started";
    if (!VALID_STATUSES.includes(courseStatus)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const courses = await readCourses();
    const nextId =
      courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;

    const newCourse = {
      id: nextId,
      name,
      description,
      target_date,
      status: courseStatus,
      created_at: new Date().toISOString(),
    };

    courses.push(newCourse);
    await writeCourses(courses);
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: "Failed to add course" });
  }
});

// PUT /api/courses/:id - Update course
app.put("/api/courses/:id", async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const courses = await readCourses();
    const index = courses.findIndex((c) => c.id === courseId);

    if (index === -1) {
      return res
        .status(404)
        .json({ error: `Course with ID ${courseId} not found` });
    }

    const { name, description, target_date, status } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}`,
      });
    }

    courses[index] = {
      ...courses[index],
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(target_date !== undefined && { target_date }),
      ...(status !== undefined && { status }),
    };

    await writeCourses(courses);
    res.json(courses[index]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update course" });
  }
});

// DELETE /api/courses/:id - Delete course
app.delete("/api/courses/:id", async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const courses = await readCourses();
    const filtered = courses.filter((c) => c.id !== courseId);

    if (courses.length === filtered.length) {
      return res
        .status(404)
        .json({ error: `Course with ID ${courseId} not found` });
    }

    await writeCourses(filtered);
    res.json({ message: `Course with ID ${courseId} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete course" });
  }
});

// Start Server
initStorage().then(() => {
  app.listen(PORT, () => {
    console.log(`- CodeCraftHub API is starting...`);
    console.log(`- Data will be stored in: \`${DATA_FILE}\``);
    console.log(`- API is available at: \`http://localhost:${PORT}\``);
  });
});
