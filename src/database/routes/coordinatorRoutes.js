const express = require("express");
const coordinatorController = require("../controllers/coordinatorController");

const router = express.Router();

router.post(
  "/register/organization",
  coordinatorController.registerOrganization
);
router.post("/register", coordinatorController.registerCoordinator);
router.post("/login", coordinatorController.loginCoordinator);
router.post("/createTask", coordinatorController.createTask);

module.exports = router;
