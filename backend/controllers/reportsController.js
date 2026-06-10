const pool = require("../db");

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const text = typeof value === "string" ? value : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

const rowsToCsv = (rows) => {
  if (!rows || rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];

  rows.forEach((row) => {
    const values = headers.map((header) => escapeCsvValue(row[header]));
    lines.push(values.join(","));
  });

  return lines.join("\n");
};

const exportEmployeesReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ep.id AS employee_id,
        u.name AS employee_name,
        d.department_name AS department,
        ep.phone,
        ep.address,
        ep.designation,
        ep.salary
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      LEFT JOIN departments d ON ep.department_id = d.id
      ORDER BY ep.id
    `);

    const csv = rowsToCsv(result.rows);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=employee-report.csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error exporting employee report" });
  }
};

const exportLeaveReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        la.id AS leave_id,
        u.name AS employee_name,
        d.department_name AS department,
        la.leave_type,
        la.from_date,
        la.to_date,
        la.reason,
        COALESCE(la.status, 'Pending') AS status,
        la.created_at
      FROM leave_applications la
      LEFT JOIN employee_profiles ep ON la.employee_id = ep.id
      LEFT JOIN users u ON ep.user_id = u.id
      LEFT JOIN departments d ON ep.department_id = d.id
      ORDER BY la.id
    `);

    const csv = rowsToCsv(result.rows);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=leave-report.csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error exporting leave report" });
  }
};

const exportAssetsReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id AS asset_id,
        a.asset_name,
        a.asset_type,
        a.serial_number,
        COALESCE(a.status, 'Available') AS status,
        u.name AS assigned_to,
        a.assigned_date,
        a.return_date
      FROM assets a
      LEFT JOIN employee_profiles ep ON a.assigned_to = ep.id
      LEFT JOIN users u ON ep.user_id = u.id
      ORDER BY a.id
    `);

    const csv = rowsToCsv(result.rows);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=asset-report.csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error exporting asset report" });
  }
};

module.exports = {
  exportEmployeesReport,
  exportLeaveReport,
  exportAssetsReport
};
