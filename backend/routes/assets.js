const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addAsset,
  getAllAssets,
  assignAsset,
  returnAsset
} = require("../controllers/assetsController");
const router = express.Router();

router.use(authMiddleware);
router.get("/", getAllAssets);
router.post("/", addAsset);
router.put("/:id/assign", assignAsset);
router.put("/:id/return", returnAsset);

module.exports = router;
