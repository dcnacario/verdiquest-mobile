const db = require("../database");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "5bh(76Hn7B5<pdz";
const bcrypt = require("bcrypt");
const Coordinator = require("../models/coordinator");

const coordinator = new Coordinator(db);

async function registerOrganization(request, response) {
  try {
    const { organizationName, organizationAddress, organizationType } =
      request.body;

    const coordinatorData = {
      organizationName,
      organizationAddress,
      organizationType,
    };

    const insertedOrganizationId = await coordinator.insertOrganization(
      coordinatorData
    );
    response.status(200).send({
      message: "Organization registered successfully!",
      organizationId: insertedOrganizationId,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function registerCoordinator(request, response) {
  try {
    const {
      firstName,
      middleInitial,
      lastName,
      gender,
      phoneNumber,
      street,
      barangay,
      city,
      province,
      username,
      password,
    } = request.body;

    // Hash the password before storing it in the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    const organizationId = await coordinator.getLastInsertedOrganizationId();

    const coordinatorData = {
      firstName,
      middleInitial,
      lastName,
      gender,
      phoneNumber,
      street,
      organizationId,
      barangay,
      city,
      province,
      username,
      password: hashedPassword,
    };

    const insertedUserId = await coordinator.insertCoordinator(coordinatorData);

    // Generate a JWT for the registered user
    const tokenPayload = { id: insertedUserId, username };
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

async function loginCoordinator(request, response) {
  try {
    const { username, password } = request.body;

    // Validate request data
    if (!username || !password) {
      return response
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const coordinatorData = { username };
    const fetchedUser = await coordinator.fetchUser(coordinatorData);

    if (fetchedUser) {
      const isMatch = await bcrypt.compare(password, fetchedUser.Password);

      if (isMatch) {
        // Generate a JWT with an expiration
        const tokenPayload = {
          id: fetchedUser.id,
          username: fetchedUser.username,
        };

        const token = jwt.sign(tokenPayload, SECRET_KEY, {
          expiresIn: "1h", // Set the token to expire in 1 hour
        });

        response.json({
          success: true,
          coordinator: fetchedUser,
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

async function createTask(request, response) {
  try {
    const {
      difficultyId,
      coordinatorId,
      taskName,
      taskType,
      taskDescription,
      taskDuration,
      taskPoints,
      Status,
    } = request.body;

    const taskData = {
      difficultyId,
      coordinatorId,
      taskName,
      taskType,
      taskDescription,
      taskDuration,
      taskPoints,
      Status,
    };

    const insertTaskId = await coordinator.insertTask(taskData);

    response.status(200).send({
      message: "Task registered successfully!",
      taskId: insertTaskId,
      success: true,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function getDifficulty(request, response) {
  try {
    const fetchedTable = await coordinator.fetchDifficulty();
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
async function getTasks(request, response) {
  try {
    const { coordinatorId } = request.query;

    const coordinatorData = { coordinatorId };
    const fetchedTable = await coordinator.fetchTasks(coordinatorData);
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

async function deleteTask(request, response) {
  try {
    const { taskId } = request.body;

    const coordinatorData = { taskId };
    const result = await coordinator.deleteTasks(coordinatorData);
    return response.json({
      success: true,
      taskId: result,
      message: "Task deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
}

async function updateTask(request, response) {
  try {
    const {
      taskName,
      taskType,
      taskDescription,
      taskPoints,
      taskDuration,
      taskId,
    } = request.body;

    const taskData = {
      taskName,
      taskType,
      taskDescription,
      taskPoints,
      taskDuration,
      taskId,
    };

    const result = await coordinator.updateTask(taskData);
    return response.json({
      message: "Task updated successfully!",
      success: true,
      result: result,
    });
  } catch (error) {}
}

async function getUserTask(request, response) {
  try {
    const { taskId } = request.body;
    const taskData = { taskId };
    const fetchedTable = await coordinator.fetchUserTasks(taskData);
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

async function updateUserTask(request, response) {
  try {
    const { Status, userDailyTaskId } = request.body;

    // Basic input validation
    if (!Status || !userDailyTaskId) {
      return response
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const userTask = {
      Status,
      userDailyTaskId,
    };

    const result = await coordinator.updateUserDailyTask(userTask);
    return response.json({
      message: "User Daily Task updated successfully!",
      success: true,
      result: result,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  registerOrganization,
  registerCoordinator,
  loginCoordinator,
  createTask,
  getDifficulty,
  getTasks,
  deleteTask,
  updateTask,
  getUserTask,
  updateUserTask,
};
