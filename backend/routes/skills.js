const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET ALL SKILLS

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM skills ORDER BY id"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching skills"
    });
  }
});

// ADD SKILL

router.post("/", async (req, res) => {
  try {
    const { skill_name } = req.body;

    const result = await pool.query(
      "INSERT INTO skills(skill_name) VALUES($1) RETURNING *",
      [skill_name]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating skill"
    });
  }
});

module.exports = router;