const pool = require("../db");

const getAuditLogs = async (req, res) => {
  try {
    const {
      action,
      search,
      sortBy = "created_at",
      sortOrder = "desc",
      page = 1,
      limit = 10
    } = req.query;

    const sortMap = {
      id: "al.id",
      action: "al.action",
      entity_type: "al.entity_type",
      user_name: "u.name",
      created_at: "al.created_at"
    };

    const orderBy = sortMap[sortBy] || "al.created_at";
    const order = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * pageSize;

    const filters = [];
    const params = [];

    if (action) {
      params.push(action);
      filters.push(`al.action = $${params.length}`);
    }

    if (search && search.trim()) {
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term, term, term);
      filters.push(`(
          LOWER(al.action) LIKE $${params.length - 4} OR
          LOWER(al.entity_type) LIKE $${params.length - 3} OR
          LOWER(COALESCE(u.name, '')) LIKE $${params.length - 2} OR
          LOWER(COALESCE(al.old_value, '')) LIKE $${params.length - 1} OR
          LOWER(COALESCE(al.new_value, '')) LIKE $${params.length}
        )`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ${whereClause}
    `;

    const dataQuery = `
      SELECT
        al.id,
        al.action,
        al.entity_type,
        al.old_value,
        al.new_value,
        al.user_id,
        COALESCE(u.name, 'System') AS user_name,
        al.created_at
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
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
    res.status(500).json({ message: "Error fetching audit logs" });
  }
};

const createAuditLog = async ({
  action,
  entity_type,
  old_value,
  new_value,
  user_id
}) => {
  const formattedOld = old_value ? JSON.stringify(old_value) : null;
  const formattedNew = new_value ? JSON.stringify(new_value) : null;

  await pool.query(
    `INSERT INTO audit_logs
      (action, entity_type, old_value, new_value, user_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [action, entity_type, formattedOld, formattedNew, user_id]
  );
};

module.exports = {
  getAuditLogs,
  createAuditLog
};
