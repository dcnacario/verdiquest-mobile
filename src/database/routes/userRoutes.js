const express = require("express");
const userController = require("../controllers/userController");
const apiSubscription = require("../controllers/apiSubscription");
const axios = require("axios");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/updateUser", userController.updateUser);
router.get("/fetchAll", userController.userAllTasks);
router.get("/fetchEasyTask", userController.userEasyTasks);
router.get("/fetchModerateTask", userController.userModerateTasks);
router.get("/fetchHardTask", userController.userHardTasks);
router.get("/fetchChallengingTask", userController.userChallengingTasks);
router.get("/fetchExpertTask", userController.userExpertTasks);
router.get("/fetchTaskDetails/:taskId", userController.fetchTaskDetails);
router.get("/fetchAllDifficulty", userController.userAllDifficultyTasks);
router.post("/acceptTask", userController.acceptTask);
router.get("/fetchAcceptedTasks/:userId", userController.fetchAcceptedTasks);
router.get(
  "/checkTaskAccepted/:userId/:taskId",
  userController.checkTaskAccepted
);
router.get("/fetchVerdiPoints/:userId", userController.fetchVerdiPoints);
router.post("/cancelTask", userController.cancelTask);
router.get("/organizations", userController.fetchOrganizations);
router.get(
  "/organizationDetails/:organizationId",
  userController.fetchOrganizationDetails
);
router.post("/joinOrg", userController.joinOrganization);
router.get("/isMember", userController.checkMembership);
router.get("/tasks/:organizationId", userController.fetchTasksByOrganization);
router.get("/organization/events/:organizationId", userController.fetchEvents);
router.get("/event/details/:eventId", userController.fetchEventDetails);
router.get("/products", userController.fetchProducts);
router.post("/applyEvent", userController.applyForEvent);
router.get("/eventApplyStatus", userController.eventApplicationStatus);
router.post("/redeemProduct", userController.redeemProduct);
router.post("/fetchPerson", userController.fetchPersonDetails);
router.post("/updatePerson", userController.updatePerson);
router.post("/updateInfo", userController.updateInfo);
router.post("/getUserDailyTask", userController.getUserDailyTask);
router.get(
  "/checkApplicationVerified",
  userController.checkApplicationVerified
);
router.post("/submitFeedback", userController.submitEventFeedback);
router.post("/fetchLimits", userController.fetchLimits);

module.exports = router;
