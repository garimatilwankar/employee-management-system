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
const leaveRoutes = require("./routes/leave");
const assetsRoutes = require("./routes/assets");
const auditRoutes = require("./routes/audit");
const notificationsRoutes = require("./routes/notifications");
const reportsRoutes = require("./routes/reports");
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
app.use("/api/leave", leaveRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetsRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/reports", reportsRoutes);
app.get(
  "/api/protected",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "Protected Route Access Granted",
      user: req.user
    });
  }
);

const ensureTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        asset_name TEXT NOT NULL,
        asset_type TEXT NOT NULL,
        serial_number TEXT UNIQUE NOT NULL,
        assigned_to INTEGER REFERENCES employee_profiles(id),
        assigned_date TIMESTAMP,
        return_date TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'Available'
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        old_value TEXT,
        new_value TEXT,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    console.log("Assets, audit_logs, and notifications tables verified or created");
  } catch (error) {
    console.error("Could not create tables", error);
  }
};

const startServer = async () => {
  await ensureTables();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
