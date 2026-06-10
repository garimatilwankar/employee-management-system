const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const { createAuditLog } = require("../controllers/auditController");
const { createNotification } = require("../controllers/notificationsController");

router.post("/apply", async (req, res) => {
  try {
    const {
      employee_id,
      leave_type,
      from_date,
      to_date,
      reason
    } = req.body;

    const result = await pool.query(
      `INSERT INTO leave_applications
      (employee_id, leave_type, from_date, to_date, reason)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        employee_id,
        leave_type,
        from_date,
        to_date,
        reason
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error applying leave" });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      search,
      sortBy = "id",
      sortOrder = "desc",
      page = 1,
      limit = 10
    } = req.query;

    const sortMap = {
      id: "la.id",
      leave_type: "la.leave_type",
      from_date: "la.from_date",
      to_date: "la.to_date",
      status: "COALESCE(la.status, 'Pending')"
    };

    const orderBy = sortMap[sortBy] || "la.id";
    const order = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * pageSize;

    const filters = [];
    const params = [];

    if (search && search.trim()) {
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term, term);
      filters.push(
        `(
          LOWER(la.leave_type) LIKE $${params.length - 3} OR
          LOWER(la.reason) LIKE $${params.length - 2} OR
          LOWER(COALESCE(la.status, 'Pending')) LIKE $${params.length - 1} OR
          CAST(la.id AS TEXT) LIKE $${params.length}
        )`
      );
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const countQuery = `SELECT COUNT(*) AS total FROM leave_applications la ${whereClause}`;
    const dataQuery = `
      SELECT *
      FROM leave_applications la
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
    res.status(500).json({ message: "Error fetching leaves" });
  }
});

router.get("/summary", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COALESCE(status, 'Pending') AS status, COUNT(*) AS count
       FROM leave_applications
       GROUP BY COALESCE(status, 'Pending')`
    );

    const summary = result.rows.reduce(
      (acc, row) => {
        const key = row.status.toLowerCase();
        acc[key] = parseInt(row.count, 10);
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 }
    );

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching leave summary" });
  }
});

router.put("/:id/approve", authMiddleware, async (req, res) => {
  try {
    const leaveResult = await pool.query(
      "SELECT * FROM leave_applications WHERE id=$1",
      [req.params.id]
    );

    if (leaveResult.rows.length === 0) {
      return res.status(404).json({ message: "Leave not found" });
    }

    const previous = leaveResult.rows[0];

    await pool.query(
      "UPDATE leave_applications SET status='Approved' WHERE id=$1",
      [req.params.id]
    );

    const userResult = await pool.query(
      "SELECT user_id FROM employee_profiles WHERE id=$1",
      [previous.employee_id]
    );

    if (userResult.rows.length > 0) {
      await createNotification({
        user_id: userResult.rows[0].user_id,
        title: "Leave Approved",
        message: "Your leave request has been approved"
      });
    }

    await createAuditLog({
      action: "Leave Approved",
      entity_type: "Leave",
      old_value: { status: previous.status },
      new_value: { status: "Approved" },
      user_id: req.user.id
    });

    res.json({ message: "Leave Approved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error approving leave" });
  }
});

router.put("/:id/reject", authMiddleware, async (req, res) => {
  try {
    const leaveResult = await pool.query(
      "SELECT * FROM leave_applications WHERE id=$1",
      [req.params.id]
    );

    if (leaveResult.rows.length === 0) {
      return res.status(404).json({ message: "Leave not found" });
    }

    const previous = leaveResult.rows[0];

    await pool.query(
      "UPDATE leave_applications SET status='Rejected' WHERE id=$1",
      [req.params.id]
    );

    const userResult = await pool.query(
      "SELECT user_id FROM employee_profiles WHERE id=$1",
      [previous.employee_id]
    );

    if (userResult.rows.length > 0) {
      await createNotification({
        user_id: userResult.rows[0].user_id,
        title: "Leave Rejected",
        message: "Your leave request has been rejected"
      });
    }

    await createAuditLog({
      action: "Leave Rejected",
      entity_type: "Leave",
      old_value: { status: previous.status },
      new_value: { status: "Rejected" },
      user_id: req.user.id
    });

    res.json({ message: "Leave Rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rejecting leave" });
  }
});

module.exports = router;
