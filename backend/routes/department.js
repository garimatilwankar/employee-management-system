const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET ALL DEPARTMENTS

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM departments ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching departments"
    });
  }
});

// ADD DEPARTMENT

router.post("/", async (req, res) => {
  try {
    const { department_name } = req.body;

    const result = await pool.query(
      "INSERT INTO departments(department_name) VALUES($1) RETURNING *",
      [department_name]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating department"
    });
  }
});

module.exports = router;