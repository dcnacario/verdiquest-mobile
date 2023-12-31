const User = require("../models/user");
const db = require("../database");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "5bh(76Hn7B5<pdz";
const bcrypt = require("bcrypt");

const user = new User(db);

async function registerUser(request, response) {
  try {
    const {
      firstName,
      middleInitial,
      lastName,
      gender,
      birthDate,
      phoneNumber,
      street,
      barangay,
      city,
      province,
      email,
      password,
    } = request.body;

    // Hash the password before storing it in the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    const userData = {
      firstName,
      middleInitial,
      lastName,
      gender,
      birthDate,
      phoneNumber,
      street,
      barangay,
      city,
      province,
      email,
      password: hashedPassword,
    };

    const insertedUserId = await user.insertUser(userData);

    // Generate a JWT for the registered user
    const tokenPayload = { id: insertedUserId, email };
    const token = jwt.sign(tokenPayload, SECRET_KEY, {
      expiresIn: "1h", // Set the token to expire in 1 hour
    });

    response.status(200).send({
      message: "User registered successfully!",
      userId: insertedUserId,
      token,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function loginUser(request, response) {
  try {
    const { email, password } = request.body;
    console.log(password);
    // Validate request data
    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const userData = { email };
    const fetchedUser = await user.fetchUser(userData);

    if (fetchedUser) {
      const isMatch = await bcrypt.compare(password, fetchedUser.Password);

      if (isMatch) {
        // Generate a JWT with an expiration
        const tokenPayload = {
          id: fetchedUser.id,
          email: fetchedUser.email,
        };

        const token = jwt.sign(tokenPayload, SECRET_KEY, {
          expiresIn: "1h", // Set the token to expire in 1 hour
        });

        response.json({
          success: true,
          user: fetchedUser,
          token: token,
        });
      } else {
        // Incorrect password
        response
          .status(401)
          .json({ success: false, message: "Incorrect password" });
      }
    } else {
      // User not found
      response
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: "Server error." });
  }
}

async function fetchPersonDetails(request, response) {
  try {
    const userId = request.body.userId;
    const person = await user.fetchPersonDetails(userId);
    return response.json({ success: true, fetchPerson: person });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function userAllTasks(request, response) {
  try {
    const fetchedTable = await user.fetchTasks();
    return response.json({
      success: true,
      fetchTable: fetchedTable,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function userEasyTasks(request, response) {
  try {
    const fetchedTable = await user.fetchEasyTask();
    return response.json({
      success: true,
      fetchedTable: fetchedTable,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function userModerateTasks(request, response) {
  try {
    const fetchedTable = await user.fetchModerateTask();
    return response.json({
      success: true,
      fetchedTable: fetchedTable,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function userHardTasks(request, response) {
  try {
    const fetchedTable = await user.fetchHardTask();
    return response.json({
      success: true,
      fetchedTable: fetchedTable,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function userChallengingTasks(request, response) {
  try {
    const fetchedTable = await user.fetchChallengingTask();
    return response.json({
      success: true,
      fetchedTable: fetchedTable,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function userExpertTasks(request, response) {
  try {
    const fetchedTable = await user.fetchExpertTask();
    return response.json({
      success: true,
      fetchedTable: fetchedTable,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}
async function updateUser(request, response) {
  try {
    const { verdiPoints, password, userId } = request.body;

    const userData = {
      verdiPoints,
      password,
      userId,
    };

    const result = await user.updateUser(userData);
    return response.json({
      message: "User updated successfully!",
      success: true,
      result: result,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: "Server error" });
  }
}

async function fetchTaskDetails(request, response) {
  try {
    const taskId = request.params.taskId;
    const taskDetails = await user.fetchTaskDetails(taskId);
    response.json({ success: true, taskDetails });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function userAllDifficultyTasks(request, response) {
  try {
    const fetchedTable = await user.fetchAllDifficultyTasks();
    response.json({
      success: true,
      fetchedTable: fetchedTable,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function acceptTask(request, response) {
  try {
    const userId = request.body.userId;
    const taskId = request.body.taskId;
    const dateTaken = new Date().toISOString().slice(0, 19).replace("T", " ");

    const result = await user.acceptTask(userId, taskId, dateTaken);

    if (result.alreadyAccepted) {
      response.status(400).json({ message: "Task already accepted." });
    } else if (result.reaccepted) {
      response.status(200).json({ message: "Mission Accepted!" });
    } else {
      response.status(200).json({ message: "Task accepted successfully." });
    }
  } catch (error) {
    console.error("Error accepting task:", error);
    response.status(500).json({ message: "Internal server error." });
  }
}

async function checkTaskAccepted(request, response) {
  const { userId, taskId } = request.params;
  try {
    const result = await user.checkTaskAccepted(userId, taskId);
    response.json({
      success: true,
      isAccepted: result.isAccepted,
      taskExpired: result.isExpired,
      isCompleted: result.isCompleted,
    });
  } catch (error) {
    console.error(`Error checking task acceptance: ${error}`);
    response.status(500).send({ success: false, message: "Server error" });
  }
}

async function fetchAcceptedTasks(request, response) {
  const userId = request.params.userId;
  try {
    const acceptedTasks = await user.fetchAcceptedTasks(userId);
    response.json({ success: true, acceptedTasks });
  } catch (error) {
    console.error(`Error fetching accepted tasks: ${error}`);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function fetchVerdiPoints(request, response) {
  try {
    const userId = request.params.userId;
    const points = await user.getVerdiPoints(userId);
    response.json({ success: true, verdiPoints: points });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Error fetching VerdiPoints",
      error: error.message,
    });
  }
}

async function cancelTask(request, response) {
  try {
    const { userId, taskId } = request.body;
    const cancelResult = await user.cancelUserDailyTask(userId, taskId);

    if (!cancelResult.taskRemoved) {
      return response.status(400).json({
        success: false,
        message: cancelResult.error,
      });
    }
    response.json({ success: true, message: "Task cancelled successfully" });
  } catch (error) {
    response.status(500).send(error);
  }
}

async function fetchOrganizations(request, response) {
  try {
    const organizations = await user.fetchAllOrganizations();
    response.json({
      success: true,
      organizations: organizations,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Error fetching organizations", error: error.message });
  }
}

async function fetchOrganizationDetails(request, response) {
  const organizationId = request.params.organizationId;
  try {
    const organizationDetails = await user.getOrganizationDetails(
      organizationId
    );
    if (organizationDetails) {
      response.json({ success: true, organization: organizationDetails });
    } else {
      response.status(404).send("Organization not found");
    }
  } catch (error) {
    response
      .status(500)
      .send("Error fetching organization details: " + error.message);
  }
}

async function joinOrganization(request, response) {
  const userId = request.body.userId;
  const organizationId = request.body.organizationId;

  try {
    const result = await user.updateUserOrganization(userId, organizationId);
    response.json({
      success: true,
      message: "Successfully joined organization",
      user: result,
    });
  } catch (error) {
    response.status(500).send("Error joining organization: " + error.message);
  }
}

async function checkMembership(request, response) {
  const userId = request.query.userId;
  const organizationId = request.query.organizationId;

  try {
    const isMember = await user.isMember(userId, organizationId);
    response.json({ success: true, isMember });
  } catch (error) {
    response.status(500).send("Error checking membership: " + error.message);
  }
}

async function fetchTasksByOrganization(request, response) {
  const organizationId = request.params.organizationId;

  try {
    const tasks = await user.getTasksByOrganization(organizationId);
    response.json({ success: true, tasks });
  } catch (error) {
    response.status(500).send("Error fetching tasks: " + error.message);
  }
}

async function fetchEvents(req, res) {
  try {
    const organizationId = req.params.organizationId;
    const events = await user.fetchEventsByOrganization(organizationId);
    res.json({ success: true, events: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function fetchEventDetails(req, res) {
  try {
    const eventId = req.params.eventId;
    const event = await user.fetchEventById(eventId);
    res.json({ success: true, event: event });
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function fetchProducts(request, response) {
  try {
    const products = await user.fetchProducts();
    response.json(products);
  } catch (error) {
    response.status(500).send(error.message);
  }
}

async function applyForEvent(request, response) {
  try {
    const { userId, eventId } = request.body;

    // Attempt to apply for the event
    const applyResult = await user.applyEvent(userId, eventId);

    // Check if the user has already applied
    if (applyResult.alreadyApplied) {
      return response.status(400).send({
        success: false,
        message: "User has already applied for this event",
      });
    }

    // Respond with success message
    response.json({
      success: true,
      message: "Applied successfully",
      apply: applyResult,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Error applying for event", error: error.message });
  }
}

async function eventApplicationStatus(request, response) {
  try {
    const { userId, eventId } = request.query;

    if (!userId || !eventId) {
      return response
        .status(400)
        .send({ message: "UserId and EventId are required" });
    }

    const status = await user.eventApplyStatus(userId, eventId);
    response.json({ success: true, status: status });
  } catch (error) {
    console.error(error);
    response.status(500).send({
      message: "Error fetching application status",
      error: error.message,
    });
  }
}

async function updatePerson(request, response) {
  try {
    const {
      email,
      password,
      firstName,
      middleInitial,
      lastName,
      phoneNumber,
      personId,
    } = request.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const personData = {
      email,
      hashedPassword,
      firstName,
      middleInitial,
      lastName,
      phoneNumber,
      personId,
    };
    const result = await user.updatePerson(personData);

    return response.json({
      message: "User updated successfully!",
      success: true,
      result: result,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Error updating for profile", error: error.message });
  }
}
async function updateInfo(request, response) {
  try {
    const userDescription = request.body.userDescription;
    const userId = request.body.userId;

    const result = await user.updateInfo(userDescription, userId);

    return response.json({
      message: "User updated successfully!",
      success: true,
      result: result,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Error updating for profile", error: error.message });
  }
}

async function getUserDailyTask(request, response) {
  try {
    const userId = request.body.userId;
    const taskId = request.body.taskId;

    const result = await user.getUserDailyTask(taskId, userId);
    return response.json({
      result: result,
      success: true,
    });
  } catch (error) {}
}

async function redeemProduct(request, response) {
  try {
    const { userId, productId, productSize, contactNumber, deliveryAddress } =
      request.body;
    const redeemResult = await user.redeemProduct(
      userId,
      productId,
      productSize,
      contactNumber,
      deliveryAddress
    );
    if (redeemResult.error) {
      if (
        redeemResult.error === "Cannot redeem product, insufficient quantity"
      ) {
        return response
          .status(400)
          .json({ success: false, message: "Product is out of stock" });
      }

      return response
        .status(400)
        .json({ success: false, message: redeemResult.error });
    }

    response.json({
      success: true,
      message: "Product redeemed successfully",
      redeem: redeemResult,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      message: "Error redeeming product",
      error: error.message,
    });
  }
}

async function checkApplicationVerified(request, response) {
  try {
    const { userId, eventId } = request.query;

    if (!userId || !eventId) {
      return response
        .status(400)
        .send({ message: "UserId and EventId are required" });
    }

    const isVerified = await user.isApplicationVerified(userId, eventId);
    const feedbackGiven = await user.isFeedbackGiven(userId, eventId);

    response.json({
      success: true,
      isVerified: isVerified,
      feedbackGiven: feedbackGiven,
    });
  } catch (error) {
    console.error(error);
    response.status(500).send({
      message: "Error checking verification status",
      error: error.message,
    });
  }
}

async function submitEventFeedback(request, response) {
  try {
    const { userId, eventId, feedback } = request.body;

    if (!userId || !eventId || !feedback) {
      return response.status(400).send({ message: "All fields are required" });
    }

    const isFeedbackGiven = await user.isFeedbackGiven(userId, eventId);
    if (isFeedbackGiven) {
      return response
        .status(400)
        .send({ message: "Feedback has already been given for this event" });
    }

    const result = await user.submitFeedback(userId, eventId, feedback);

    response.json({
      success: result.success,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error(error);
    response.status(500).send({
      message: "Error submitting feedback",
      error: error.message,
    });
  }
}

async function fetchLimits(request, response) {
  try {
    const { organizationId, userId, difficultyId } = request.body;

    const fetchedTable = await user.fetchLimits(
      organizationId,
      userId,
      difficultyId
    );

    return response.json({
      success: true,
      fetchTable: fetchedTable,
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  userAllTasks,
  userEasyTasks,
  userModerateTasks,
  userHardTasks,
  userChallengingTasks,
  userExpertTasks,
  fetchTaskDetails,
  userAllDifficultyTasks,
  acceptTask,
  fetchAcceptedTasks,
  checkTaskAccepted,
  fetchVerdiPoints,
  cancelTask,
  fetchOrganizations,
  fetchOrganizationDetails,
  joinOrganization,
  checkMembership,
  fetchTasksByOrganization,
  fetchEvents,
  fetchEventDetails,
  fetchProducts,
  applyForEvent,
  eventApplicationStatus,
  fetchPersonDetails,
  updatePerson,
  updateInfo,
  getUserDailyTask,
  redeemProduct,
  checkApplicationVerified,
  submitEventFeedback,
  fetchLimits,
};
