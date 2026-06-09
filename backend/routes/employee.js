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
    const {
      search,
      sortBy = "id",
      sortOrder = "asc",
      page = 1,
      limit = 10
    } = req.query;

    const sortMap = {
      id: "ep.id",
      name: "u.name",
      department_name: "d.department_name",
      phone: "ep.phone",
      designation: "ep.designation",
      salary: "ep.salary"
    };

    const orderBy = sortMap[sortBy] || "ep.id";
    const order = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * pageSize;

    const filters = [];
    const params = [];

    if (search && search.trim()) {
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term, term, term);
      filters.push(
        `(
          LOWER(u.name) LIKE $${params.length - 4} OR
          LOWER(d.department_name) LIKE $${params.length - 3} OR
          LOWER(ep.phone) LIKE $${params.length - 2} OR
          LOWER(ep.designation) LIKE $${params.length - 1} OR
          LOWER(ep.address) LIKE $${params.length}
        )`
      );
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN departments d ON ep.department_id = d.id
      ${whereClause}
    `;

    const dataQuery = `
      SELECT
        ep.id,
        u.name,
        d.department_name,
        ep.phone,
        ep.address,
        ep.designation,
        ep.salary
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN departments d ON ep.department_id = d.id
      ${whereClause}
      ORDER BY ${orderBy} ${order}
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `;

    const countResult = await pool.query(countQuery, params);
    const dataResult = await pool.query(dataQuery, [...params, pageSize, offset]);

    res.json({
      rows: dataResult.rows,
      total: parseInt(countResult.rows[0].total, 10)
    });
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