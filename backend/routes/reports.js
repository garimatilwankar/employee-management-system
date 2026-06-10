const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  exportEmployeesReport,
  exportLeaveReport,
  exportAssetsReport
} = require("../controllers/reportsController");

const router = express.Router();

router.use(authMiddleware);
router.get("/export/employees", exportEmployeesReport);
router.get("/export/leaves", exportLeaveReport);
router.get("/export/assets", exportAssetsReport);

module.exports = router;
