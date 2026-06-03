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

    const images =
      await pool.query(
        "SELECT COUNT(*) FROM employee_images"
      );

    res.json({
      employees: employees.rows[0].count,
      departments: departments.rows[0].count,
      skills: skills.rows[0].count,
      images: images.rows[0].count
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching statistics"
    });
  }
});

module.exports = router;