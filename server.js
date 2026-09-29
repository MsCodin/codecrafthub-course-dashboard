const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data", "courses.json");

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Helper function: Read courses from JSON file
async function readCourses() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}

// Helper function: Write courses to JSON file
async function writeCourses(courses) {
  await fs.writeFile(DATA_FILE, JSON.stringify(courses, null, 2), "utf8");
}

// 1. GET all courses
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await readCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve courses" });
  }
});

// 2. GET course by ID
app.get("/api/courses/:id", async (req, res) => {
  try {
    const courses = await readCourses();
    const course = courses.find((c) => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve course" });
  }
});

// 3. POST create new course
app.post("/api/courses", async (req, res) => {
  try {
    const { name, description, targetDate } = req.body;

    if (!name || !targetDate) {
      return res
        .status(400)
        .json({ error: "Course name and target date are required." });
    }

    const courses = await readCourses();
    const newCourse = {
      id: Date.now().toString(), // Simple unique ID generation
      name,
      description: description || "",
      targetDate,
      status: "Not Started",
    };

    courses.push(newCourse);
    await writeCourses(courses);

    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: "Failed to add course" });
  }
});

// 4. PUT update existing course
app.put("/api/courses/:id", async (req, res) => {
  try {
    const courses = await readCourses();
    const index = courses.findIndex((c) => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Course not found" });
    }

    const { name, description, targetDate, status } = req.body;

    // Validate status if provided
    const validStatuses = ["Not Started", "In Progress", "Completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Merge updated fields into existing course
    courses[index] = {
      ...courses[index],
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(targetDate && { targetDate }),
      ...(status && { status }),
    };

    await writeCourses(courses);
    res.json(courses[index]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update course" });
  }
});

// 5. DELETE course
app.delete("/api/courses/:id", async (req, res) => {
  try {
    const courses = await readCourses();
    const filteredCourses = courses.filter((c) => c.id !== req.params.id);

    if (courses.length === filteredCourses.length) {
      return res.status(404).json({ error: "Course not found" });
    }

    await writeCourses(filteredCourses);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete course" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`CodeCraftHub server listening at http://localhost:${PORT}`);
});
