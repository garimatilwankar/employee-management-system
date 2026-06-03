require("dotenv").config();
const skillsRoutes = require("./routes/skills");
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const departmentRoutes = require("./routes/department");
const employeeRoutes = require("./routes/employee");
const dashboardRoutes = require("./routes/dashboard");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Backend Connected Successfully",
      time: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database Connection Failed"
    });
  }
});

const PORT = process.env.PORT || 5000;
app.use("/api/departments", departmentRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.get(
  "/api/protected",
  authMiddleware,
  (req, res) => {

    res.json({
      message:
        "Protected Route Access Granted",
      user: req.user
    });

  }
);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});