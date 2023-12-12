const express = require("express");
const coordinatorController = require("../controllers/coordinatorController");

const router = express.Router();

router.post(
  "/register/organization",
  coordinatorController.registerOrganization
);
router.post("/register", coordinatorController.registerCoordinator);
router.post("/login", coordinatorController.loginCoordinator);
router.get("/fetchDifficulty", coordinatorController.getDifficulty);
router.get("/fetchTasks", coordinatorController.getTasks);
router.post("/deleteTask", coordinatorController.deleteTask);
router.post("/updateTask", coordinatorController.updateTask);
router.post("/getTasks", coordinatorController.getUserTask);
router.post("/updateUserTask", coordinatorController.updateUserTask);
router.post("/fetchEvents", coordinatorController.getEvents);
router.post("/updateEvent", coordinatorController.updateEvent);
router.post("/deleteEvent", coordinatorController.deleteEvent);
router.post("/fetchParticipants", coordinatorController.getParticipants);
router.post(
  "/fetchParticipantsVerified",
  coordinatorController.getParticipantsVerified
);
router.post("/updateParticipant", coordinatorController.updateParticipant);
router.post(
  "/fetchCountParticipants",
  coordinatorController.getCountParticipants
);
router.post("/fetchCountTakers", coordinatorController.getCountTakers);
router.post("/fetchTaskTakers", coordinatorController.getUserCountTakers);
router.post("/updateCoordinator", coordinatorController.updateCoordinator);
router.post("/fetchCoordinator", coordinatorController.fetchCoordinator);
router.post("/updateOrganization", coordinatorController.updateOrganization);
router.post("/getUsersByOrg", coordinatorController.getUsersByOrg);
router.post("/removeUserFromOrg", coordinatorController.removeUserFromOrg);
router.post("/deleteOrg", coordinatorController.deleteOrganization);
router.post("/fetchProducts", coordinatorController.fetchProducts);
router.post("/updateProduct", coordinatorController.updateProduct);
router.post("/deleteProduct", coordinatorController.deleteProduct);
router.post("/fetchCoordinators", coordinatorController.fetchCoordinators);
router.post("/updateTaskLimit", coordinatorController.updateTaskLimit);
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

module.exports = router;
