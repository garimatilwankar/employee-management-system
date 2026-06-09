const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getAuditLogs } = require("../controllers/auditController");
const router = express.Router();

router.use(authMiddleware);
router.get("/", getAuditLogs);

module.exports = router;
