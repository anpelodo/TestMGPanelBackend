const express = require("express");
const subsController = require("../controllers/subscriberController");

const router = express.Router();

router.post("/login");

router.post("/subscriber", subsController.add);
router.get("/subscriber", subsController.list);
router.patch("/subscriber", subsController.update);
router.delete("/subscriber", subsController.delete);

module.exports = router;
