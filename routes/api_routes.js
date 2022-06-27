const express = require("express");
const router = express.Router();

const packageController = require("../controllers/api_controller");
const cacheMiddleware = require("../middleware/checkRedisData");

router.get("/", packageController.getPackages);
router.post("/create", packageController.createPackage);
router.get("/:id", packageController.singlePackage);
// router.get("/search/:value", packageController.getSearchedContent);
router.put("/:id", packageController.updatePackage);
router.put("/plan/:id", packageController.addPlanToThePackage);
router.delete("/:id", packageController.deletePackage);

module.exports = router;
