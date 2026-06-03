const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({ storage });

// CREATE EMPLOYEE

router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      department_id,
      phone,
      address,
      designation,
      salary
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO employee_profiles
      (
        user_id,
        department_id,
        phone,
        address,
        designation,
        salary
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        user_id,
        department_id,
        phone,
        address,
        designation,
        salary
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating employee"
    });
  }
});

// GET ALL EMPLOYEES WITH JOIN

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ep.id,
        u.name,
        d.department_name,
        ep.phone,
        ep.address,
        ep.designation,
        ep.salary
      FROM employee_profiles ep
      INNER JOIN users u
      ON ep.user_id = u.id
      INNER JOIN departments d
      ON ep.department_id = d.id
      ORDER BY ep.id
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching employees"
    });
  }
});

router.post(
  "/upload",
  upload.array("images", 5),
  (req, res) => {
    res.json({
      message: "Files uploaded successfully",
      files: req.files,
    });
  }
);

module.exports = router;