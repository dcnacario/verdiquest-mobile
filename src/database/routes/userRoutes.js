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
router.get("/fetchNormalTask", userController.userNormalTasks);
router.get("/fetchHardTask", userController.userHardTasks);
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
router.post("/subscribe", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/links",
      {
        data: {
          attributes: {
            amount: 12900,
            description: "Subscription for VerdiQuest",
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            "sk_test_Po7Yyc5yDxdHNgNxWbgMsRTq"
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const checkoutUrl = response.data.data.attributes.checkout_url;
    console.log(checkoutUrl.toString());
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error);
    res.status(500).send("Error creating payment link");
  }
});
router.post("/fetchPerson", userController.fetchPersonDetails);
router.post("/updatePerson", userController.updatePerson);
router.post("/updateInfo", userController.updateInfo);
router.post("/getUserDailyTask", userController.getUserDailyTask);
router.get("/checkApplicationVerified", userController.checkApplicationVerified);
router.post("/submitFeedback", userController.submitEventFeedback);



module.exports = router;
