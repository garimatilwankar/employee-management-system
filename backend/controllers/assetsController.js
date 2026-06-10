const pool = require("../db");
const { createAuditLog } = require("./auditController");
const { createNotification } = require("./notificationsController");

const addAsset = async (req, res) => {
  try {
    const { asset_name, asset_type, serial_number } = req.body;

    if (!asset_name || !asset_type || !serial_number) {
      return res.status(400).json({
        message: "Asset name, type, and serial number are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO assets
        (asset_name, asset_type, serial_number)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [asset_name, asset_type, serial_number]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error adding asset"
    });
  }
};

const getAllAssets = async (req, res) => {
  try {
    const {
      search,
      sortBy = "asset_name",
      sortOrder = "asc",
      page = 1,
      limit = 10
    } = req.query;

    const sortMap = {
      asset_name: "a.asset_name",
      asset_type: "a.asset_type",
      serial_number: "a.serial_number",
      status: "a.status",
      assigned_to_name: "u.name"
    };

    const orderBy = sortMap[sortBy] || "a.asset_name";
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
          LOWER(a.asset_name) LIKE $${params.length - 4} OR
          LOWER(a.asset_type) LIKE $${params.length - 3} OR
          LOWER(a.serial_number) LIKE $${params.length - 2} OR
          LOWER(a.status) LIKE $${params.length - 1} OR
          LOWER(u.name) LIKE $${params.length}
        )`
      );
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM assets a
      LEFT JOIN employee_profiles ep ON a.assigned_to = ep.id
      LEFT JOIN users u ON ep.user_id = u.id
      ${whereClause}
    `;

    const dataQuery = `
      SELECT
        a.id,
        a.asset_name,
        a.asset_type,
        a.serial_number,
        a.assigned_date,
        a.return_date,
        a.status,
        a.assigned_to,
        u.name AS assigned_to_name
      FROM assets a
      LEFT JOIN employee_profiles ep ON a.assigned_to = ep.id
      LEFT JOIN users u ON ep.user_id = u.id
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
      message: "Error fetching assets"
    });
  }
};

const assignAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({
        message: "Employee ID is required to assign an asset"
      });
    }

    const assetResult = await pool.query(
      "SELECT * FROM assets WHERE id=$1",
      [id]
    );

    if (assetResult.rows.length === 0) {
      return res.status(404).json({
        message: "Asset not found"
      });
    }

    const employeeResult = await pool.query(
      "SELECT * FROM employee_profiles WHERE id=$1",
      [employee_id]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    const previousAsset = assetResult.rows[0];

    const result = await pool.query(
      `UPDATE assets
       SET assigned_to = $1,
           assigned_date = NOW(),
           return_date = NULL,
           status = 'Assigned'
       WHERE id = $2
       RETURNING *`,
      [employee_id, id]
    );

    const userId = employeeResult.rows[0].user_id;
    if (userId) {
      await createNotification({
        user_id: userId,
        title: "Asset Assigned",
        message: "A new asset has been assigned to you"
      });
    }

    await createAuditLog({
      action: "Asset Assigned",
      entity_type: "Asset",
      old_value: {
        assigned_to: previousAsset.assigned_to,
        assigned_date: previousAsset.assigned_date,
        return_date: previousAsset.return_date,
        status: previousAsset.status
      },
      new_value: {
        assigned_to: employee_id,
        assigned_date: new Date().toISOString(),
        return_date: null,
        status: "Assigned"
      },
      user_id: req.user ? req.user.id : null
    });

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error assigning asset"
    });
  }
};

const returnAsset = async (req, res) => {
  try {
    const { id } = req.params;

    const assetResult = await pool.query(
      "SELECT * FROM assets WHERE id=$1",
      [id]
    );

    if (assetResult.rows.length === 0) {
      return res.status(404).json({
        message: "Asset not found"
      });
    }

    const previousAsset = assetResult.rows[0];

    const result = await pool.query(
      `UPDATE assets
       SET assigned_to = NULL,
           return_date = NOW(),
           status = 'Available'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    await createAuditLog({
      action: "Asset Returned",
      entity_type: "Asset",
      old_value: {
        assigned_to: previousAsset.assigned_to,
        assigned_date: previousAsset.assigned_date,
        return_date: previousAsset.return_date,
        status: previousAsset.status
      },
      new_value: {
        assigned_to: null,
        assigned_date: previousAsset.assigned_date,
        return_date: new Date().toISOString(),
        status: "Available"
      },
      user_id: req.user ? req.user.id : null
    });

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error returning asset"
    });
  }
};

module.exports = {
  addAsset,
  getAllAssets,
  assignAsset,
  returnAsset
};
