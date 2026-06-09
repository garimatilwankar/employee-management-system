const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/stats", async (req, res) => {
  try {

    const employees =
      await pool.query(
        "SELECT COUNT(*) FROM employee_profiles"
      );

    const departments =
      await pool.query(
        "SELECT COUNT(*) FROM departments"
      );

    const skills =
      await pool.query(
        "SELECT COUNT(*) FROM skills"
      );

    const totalAssets = await pool.query(
      "SELECT COUNT(*) FROM assets"
    );

    const leaveRequests = await pool.query(
      "SELECT COUNT(*) FROM leave_applications"
    );

    res.json({
      employees: employees.rows[0].count,
      departments: departments.rows[0].count,
      skills: skills.rows[0].count,
      total_assets: totalAssets.rows[0].count,
      leave_requests: leaveRequests.rows[0].count
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching statistics"
    });
  }
});

router.get("/department-counts", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         d.department_name AS name,
         COUNT(ep.id) AS value
       FROM departments d
       LEFT JOIN employee_profiles ep
         ON ep.department_id = d.id
       GROUP BY d.department_name
       ORDER BY value DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching department counts" });
  }
});

router.get("/leave-status", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         COALESCE(status, 'Pending') AS name,
         COUNT(*) AS value
       FROM leave_applications
       GROUP BY COALESCE(status, 'Pending')
       ORDER BY
         CASE
           WHEN COALESCE(status, 'Pending') = 'Pending' THEN 1
           WHEN status = 'Approved' THEN 2
           WHEN status = 'Rejected' THEN 3
           ELSE 4
         END`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching leave status distribution" });
  }
});

router.get("/asset-allocation", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT status AS name, COUNT(*) AS value
       FROM assets
       GROUP BY status
       ORDER BY value DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching asset allocation" });
  }
});

module.exports = router;