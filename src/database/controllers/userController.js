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
    }catch (error) {
      console.error(error);
      response
        .status(500)
        .send({ message: "Server error", error: error.message });
    };
}

async function userNormalTasks(request, response) {
    try {
      const fetchedTable = await user.fetchNormalTask();
      return response.json({
        success: true,
        fetchedTable: fetchedTable,
      });
    }catch (error) {
      console.error(error);
      response
        .status(500)
        .send({ message: "Server error", error: error.message });
    };
}

async function userHardTasks(request, response) {
    try {
      const fetchedTable = await user.fetchHardTask();
      return response.json({
        success: true,
        fetchedTable: fetchedTable,
      });
    }catch (error) {
      console.error(error);
      response
        .status(500)
        .send({ message: "Server error", error: error.message });
    };
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
        response.status(500).send({ message: "Server error", error: error.message });
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
        response.status(500).send({ message: "Server error", error: error.message });
    }
}


async function acceptTask(request, response) {
  const { userId, taskId } = request.body; 

  // Check if userId and taskId are provided
  if (!userId || !taskId) {
      response.status(400).send({ success: false, message: 'UserId and TaskId must be provided' });
      return;
  }

  try {
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const acceptResult = await user.acceptTask(userId, taskId, currentDate);
    
    if (acceptResult.alreadyAccepted) {
        response.status(409).send({ success: false, message: 'Task is already accepted.' });
        return;
    }

    if (acceptResult.result.affectedRows > 0) {
        response.json({ success: true, message: 'Task accepted successfully.' });
    } else {
        response.status(404).send({ success: false, message: 'Task not found.' });
    }
  } catch (error) {
      console.error(`Error accepting task: ${error}`);
      response.status(500).send({ success: false, message: 'Server error' });
  }
}

async function checkTaskAccepted(request, response) {
  const { userId, taskId } = request.params;

  try {
      const isAccepted = await user.checkTaskAccepted(userId, taskId);
      response.json({ success: true, isAccepted });
  } catch (error) {
      console.error(`Error checking task acceptance: ${error}`);
      response.status(500).send({ success: false, message: 'Server error' });
  }
}

async function fetchAcceptedTasks(request, response) {
  const userId = request.params.userId;
  try {
      const acceptedTasks = await user.fetchAcceptedTasks(userId);
      response.json({ success: true, acceptedTasks });
  } catch (error) {
      console.error(`Error fetching accepted tasks: ${error}`);
      response.status(500).send({ message: "Server error", error: error.message });
  }
}


module.exports = {
  registerUser,
  loginUser,
  updateUser,
  userAllTasks,
  userEasyTasks,
  userNormalTasks,
  userHardTasks,
  fetchTaskDetails,
  userAllDifficultyTasks,
  acceptTask,
  fetchAcceptedTasks,
  checkTaskAccepted
};
