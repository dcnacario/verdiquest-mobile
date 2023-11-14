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
    const coordinatorData = { username, password };
    const fetchedUser = await coordinator.fetchUser(coordinatorData);
    console.log(coordinatorData.username);
    console.log(coordinatorData.password);

    if (fetchedUser) {
      if (!password || !fetchedUser.Password) {
        // Handle error: one of the passwords is undefined or null
        return response.status(400).json({ message: "Invalid request data" });
      }
      const isMatch = await bcrypt.compare(password, fetchedUser.Password);

      if (fetchedUser && fetchedUser.Password) {
        // Generate a JWT with an expiration
        const tokenPayload = {
          id: fetchedUser.id,
          username: fetchedUser.username,
        };

        const token = jwt.sign(tokenPayload, SECRET_KEY, {
          expiresIn: "1h", // Set the token to expire in 1 hour
        });

        response.json({ success: true, user: fetchedUser, token: token });
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

module.exports = {
  registerOrganization,
  registerCoordinator,
  loginCoordinator,
};
