const BaseModel = require("./BaseModel");
const bcrypt = require("bcrypt");

class User extends BaseModel {
  constructor(db) {
    // Accept the 'db' object as a parameter
    super("user");
    this.db = db; // Assign the 'db' object to the instance variable
  }

  async insertUser(userData) {
    try {
      // Check if email already exists
      const [existingUser] = await this.db.query(
        `SELECT Email FROM ${this.tableName} WHERE Email = ?`,
        [userData.email]
      );

      // If email exists, throw an error or return a specific message
      if (existingUser.length > 0) {
        throw new Error("Email already registered");
      }

      const formatDate = (date) => {
        return date.toISOString().slice(0, 10);
      };

      const [result] = await this.db.query(
        `INSERT INTO ${this.tableName} (SubscriptionStatus, VerdiPoints, Email, Password, ProfilePicture, TaskCount, DateRegistered, LastActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Inactive",
          0,
          userData.email,
          userData.password,
          "",
          0,
          formatDate(new Date()),
          formatDate(new Date()),
        ]
      );
      const insertedId = result.insertId;

      const [person] = await this.db.query(
        "INSERT INTO person (UserId, FirstName, LastName, Initial,  Birthdate, PhoneNumber, Gender, Street, Barangay, City, Province) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          insertedId,
          userData.firstName,
          userData.lastName,
          userData.middleInitial,
          userData.birthDate,
          userData.phoneNumber,
          userData.gender,
          userData.street,
          userData.barangay,
          userData.city,
          userData.province,
        ]
      );
      return insertedId;
    } catch (error) {
      console.error(`Error inserting user`, error);
      throw error;
    }
  }

  async fetchUser(userData) {
    try {
      // Fetch the user by email
      const [result] = await this.db.query(
        "SELECT * FROM user WHERE email = ?",
        [userData.email]
      );
      const user = result[0];

      if (!user) {
        return null;
      }

      if (userData.password) {
        try {
          const isPasswordValid = await bcrypt.compare(
            userData.password,
            user.Password
          );

          if (isPasswordValid) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          return error;
        }
      } else {
        return user;
      }
    } catch (error) {
      console.error(`Error fetching user`, error);
      throw error;
    }
  }

  async fetchPersonDetails(userId) {
    try {
      const [user] = await this.db.query(
        "SELECT * FROM person WHERE UserId = ?",
        [userId]
      );
      return user.length > 0 ? user[0] : null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateUser(userData) {
    try {
      const [user] = await this.db.query(
        "UPDATE user SET VerdiPoints = VerdiPoints + ? WHERE UserId = ?",
        [userData.verdiPoints, userData.userId]
      );

      const userUpdate = user.affectedRows;
      return userUpdate;
    } catch (error) {
      console.error(`Error updating user: ${error}`);
      throw error;
    }
  }
  async fetchTasks() {
    try {
      const [result] = await this.db.query(
        "SELECT * FROM dailytask WHERE isDeleted = 0"
      );
      return result.length > 0 ? result : [];
    } catch (error) {
      console.error(`Error fetching tasks: ${error}`);
      throw error;
    }
  }

  async fetchEasyTask() {
    try {
      const [result] = await this.db.query(
        "SELECT dt.* FROM dailytask dt LEFT JOIN userdailytask udt ON dt.TaskId = udt.TaskId WHERE dt.DifficultyId = 1 AND udt.TaskStatus is NULL"
      );
      return result.length > 0 ? result : [];
    } catch (error) {
      console.error(`Error fetching easy tasks: ${error}`);
      throw error;
    }
  }

  async fetchNormalTask() {
    try {
      const [result] = await this.db.query(
        "SELECT dt.* FROM dailytask dt LEFT JOIN userdailytask udt ON dt.TaskId = udt.TaskId WHERE dt.DifficultyId = 2 AND udt.TaskStatus is NULL;"
      );
      return result.length > 0 ? result : [];
    } catch (error) {
      console.error(`Error fetching easy tasks: ${error}`);
      throw error;
    }
  }

  async fetchHardTask() {
    try {
      const [result] = await this.db.query(
        "SELECT dt.* FROM dailytask dt LEFT JOIN userdailytask udt ON dt.TaskId = udt.TaskId WHERE dt.DifficultyId = 3 AND udt.TaskStatus is NULL ;"
      );
      return result.length > 0 ? result : [];
    } catch (error) {
      console.error(`Error fetching easy tasks: ${error}`);
      throw error;
    }
  }

  async fetchTaskDetails(taskId) {
    try {
      const [result] = await this.db.query(
        "SELECT * FROM dailytask WHERE TaskId = ?",
        [taskId]
      );
      return result[0];
    } catch (error) {
      console.error(`Error fetching task details: ${error}`);
      throw error;
    }
  }

  async fetchAllDifficultyTasks() {
    try {
      const [result] = await this.db.query(
        "SELECT dt.* FROM dailytask dt LEFT JOIN userdailytask udt ON dt.TaskId = udt.TaskId WHERE dt.isDeleted = 0 AND udt.TaskStatus is NULL ORDER BY dt.DifficultyId ASC;"
      );
      return result.length > 0 ? result : [];
    } catch (error) {
      console.error(`Error fetching all tasks: ${error}`);
      throw error;
    }
  }

  async acceptTask(userId, taskId) {
    try {
      await this.db.query("START TRANSACTION");
      const checkQuery = `
                SELECT *, IF(HasBeenCancelled, true, false) as PreviouslyCanceled 
                FROM userdailytask 
                WHERE UserId = ? AND TaskId = ?
            `;
      const [existingTasks] = await this.db.query(checkQuery, [userId, taskId]);

      if (existingTasks.length > 0) {
        if (existingTasks[0].PreviouslyCanceled) {
          // Re-accepting a previously cancelled task
          const updateQuery = `
                        UPDATE userdailytask 
                        SET HasBeenCancelled = false, DateTaken = NOW(), TaskStatus = 'Ongoing' 
                        WHERE UserId = ? AND TaskId = ?
                    `;
          await this.db.query(updateQuery, [userId, taskId]);
          await this.db.query("COMMIT");
          return { reaccepted: true, alreadyAccepted: false };
        } else {
          // Task is already accepted and not canceled
          await this.db.query("COMMIT");
          return { alreadyAccepted: true };
        }
      } else {
        // Accepting the task for the first time
        const insertQuery = `
                    INSERT INTO userdailytask (UserId, TaskId, DateTaken, TaskStatus) 
                    VALUES (?, ?, NOW(), 'Ongoing')
                `;
        await this.db.query(insertQuery, [userId, taskId]);

        // Optionally update task count
        const updateTaskCountQuery = `
                    UPDATE user 
                    SET TaskCount = TaskCount + 1 
                    WHERE UserId = ?
                `;
        await this.db.query(updateTaskCountQuery, [userId]);
        await this.db.query("COMMIT");

        return { accepted: true, alreadyAccepted: false };
      }
    } catch (error) {
      await this.db.query("ROLLBACK");
      throw error;
    }
  }

  async checkTaskAccepted(userId, taskId) {
    try {
      await this.db.query("START TRANSACTION");
      const query = `
                SELECT udt.*, dt.TaskDuration FROM userdailytask udt
                JOIN dailytask dt ON udt.TaskId = dt.TaskId
                WHERE udt.UserId = ? AND udt.TaskId = ?
            `;
      const [results] = await this.db.query(query, [userId, taskId]);

      if (results.length > 0) {
        const task = results[0];
        const taskEndTime = new Date(task.DateTaken);
        taskEndTime.setMinutes(taskEndTime.getMinutes() + task.TaskDuration);

        // Check if the task has expired
        if (new Date() > taskEndTime && task.TaskStatus === "Ongoing") {
          const updateQuery = `
                        UPDATE userdailytask 
                        SET TaskStatus = 'Expired', DateFinished = NOW()
                        WHERE UserId = ? AND TaskId = ?
                    `;
          await this.db.query(updateQuery, [userId, taskId]);
          await this.db.query("COMMIT");
          return { isAccepted: false, isExpired: true };
        }
        // Check if the task has been cancelled
        else if (task.TaskStatus === "Cancelled") {
          await this.db.query("COMMIT");
          return { isAccepted: false, isExpired: false };
        }

        await this.db.query("COMMIT");
        return {
          isAccepted: true,
          dateTaken: task.DateTaken,
          taskDuration: task.TaskDuration,
          isExpired: false,
        };
      } else {
        await this.db.query("COMMIT");
        return { isAccepted: false, isExpired: false };
      }
    } catch (error) {
      await this.db.query("ROLLBACK");
      console.error("Error in checkTaskAccepted:", error);
      throw error;
    }
  }

  async fetchAcceptedTasks(userId) {
    const query = `
            SELECT udt.*, dt.TaskImage, dt.TaskName, dt.DifficultyId, dt.TaskDescription, dt.TaskPoints
            FROM userdailytask udt
            JOIN dailytask dt ON udt.TaskId = dt.TaskId
            WHERE udt.UserId = ? AND udt.TaskStatus = 'Ongoing' AND udt.HasBeenCancelled = 0
            ORDER BY dt.DifficultyId ASC
        `;
    const [tasks] = await this.db.query(query, [userId]);
    return tasks;
  }

  async cancelUserDailyTask(userId, taskId) {
    const updateQuery = `UPDATE userdailytask SET HasBeenCancelled = true, TaskStatus = 'Cancelled' WHERE UserId = ? AND TaskId = ?`;

    const [result] = await this.db.query(updateQuery, [userId, taskId]);

    if (result.affectedRows === 0) {
      return {
        error: "Task not found or already canceled",
        taskRemoved: false,
      };
    }

    // Return a successful response
    return { message: "Task marked as canceled", taskRemoved: true };
  }

  async getVerdiPoints(userId) {
    const query = `SELECT VerdiPoints FROM user WHERE UserId = ?`;
    try {
      const result = await this.db.query(query, [userId]);
      return result[0][0].VerdiPoints;
    } catch (error) {
      throw error;
    }
  }

  async fetchAllOrganizations() {
    const query = `SELECT * FROM organization`;
    try {
      const [rows] = await this.db.execute(query);
      return rows;
    } catch (error) {
      throw new Error("Error fetching organizations: " + error.message);
    }
  }

  async getOrganizationDetails(organizationId) {
    const query = "SELECT * FROM organization WHERE OrganizationId = ?";
    try {
      const [rows] = await this.db.execute(query, [organizationId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error("Error fetching organization details: " + error.message);
    }
  }

  async updateUserOrganization(userId, organizationId) {
    const query = "UPDATE user SET OrganizationId = ? WHERE UserId = ?";
    try {
      const [result] = await this.db.execute(query, [organizationId, userId]);

      const [user] = await this.db.execute(
        "SELECT * FROM user WHERE UserId = ? ",
        [userId]
      );
      return user;
    } catch (error) {
      throw new Error("Error updating user organization: " + error.message);
    }
  }

  async isMember(userId, organizationId) {
    const query =
      "SELECT COUNT(*) AS memberCount FROM user WHERE UserId = ? AND OrganizationId = ?";
    try {
      const [rows] = await this.db.execute(query, [userId, organizationId]);
      return rows[0].memberCount > 0;
    } catch (error) {
      throw new Error("Error checking membership: " + error.message);
    }
  }

  async getTasksByOrganization(organizationId) {
    const query = "SELECT * FROM dailytask WHERE OrganizationId = ?";
    try {
      const [tasks] = await this.db.execute(query, [organizationId]);
      return tasks;
    } catch (error) {
      throw new Error("Error fetching tasks: " + error.message);
    }
  }

  async fetchEventsByOrganization(organizationId) {
    const query = "SELECT * FROM event WHERE OrganizationId = ?";
    try {
      const [events] = await this.db.query(query, [organizationId]);
      return events;
    } catch (error) {
      throw new Error("Error fetching events" + error.message);
    }
  }

  async fetchEventById(eventId) {
    const query = "SELECT * FROM event WHERE EventId = ?";
    try {
      const [event] = await this.db.query(query, [eventId]);
      return event[0];
    } catch (error) {
      throw new Error("Error fetching event id " + error.message);
    }
  }

  async fetchProducts() {
    try {
      const query =
        "SELECT ProductName, ProductDescription, PointsRequired FROM products";
      const [products] = await this.db.query(query);
      return products;
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  }

  async applyEvent(userId, eventId) {
    const eventQuery = `SELECT OrganizationId FROM event WHERE EventId = ?`;
    const [eventData] = await this.db.query(eventQuery, [eventId]);

    if (!eventData || eventData.length === 0) {
      return { error: "Event not found or invalid EventId" };
    }

    const organizationId = eventData[0].OrganizationId;

    const checkQuery = `SELECT * FROM participants WHERE UserId = ? AND EventId = ?`;
    const [existingApplications] = await this.db.query(checkQuery, [
      userId,
      eventId,
    ]);

    if (existingApplications.length > 0) {
      return { alreadyApplied: true };
    }

    try {
      await this.db.query("START TRANSACTION");

      const insertQuery = `
                INSERT INTO participants (UserId, EventId, OrganizationId, Status, Feedback) 
                VALUES (?, ?, ?, 'UNVERIFIED', NULL)
            `;
      await this.db.query(insertQuery, [userId, eventId, organizationId]);

      // Commit the transaction
      await this.db.query("COMMIT");

      return { result: "Event Application Successful", alreadyApplied: false };
    } catch (error) {
      await this.db.query("ROLLBACK");
      throw error;
    }
  }

  async eventApplyStatus(userId, eventId) {
    const query =
      "SELECT * FROM participants WHERE UserId = ? AND EventId = ? AND Status = 'UNVERIFIED'";
    const [results] = await this.db.query(query, [userId, eventId]);
    return results.length > 0;
  }

  async updatePerson(personData) {
    const query =
      "UPDATE person SET FirstName = ?, Initial = ?, LastName = ?, PhoneNumber = ? WHERE PersonId = ?";
    const [results] = await this.db.query(query, [
      personData.firstName,
      personData.middleInitial,
      personData.lastName,
      personData.phoneNumber,
      personData.personId,
    ]);

    const [result_user] = await this.db.query(
      "UPDATE user SET Email = ?, Password = ?  WHERE UserId = ?",
      [personData.email, personData.password, personData.UserId]
    );
    return result_user.affectedRows;
  }

  async updateInfo(userDescription, userId) {
    try {
      const query = "UPDATE user SET UserDescription = ? WHERE UserId = ?";
      const [results] = await this.db.query(query, [userDescription, userId]);
      return results.affectedRows;
    } catch (error) {
      throw new Error("Error updating info: " + error.message);
    }
  }

  async getUserDailyTask(taskId, userId) {
    try {
      const [rows] = await this.db.query(
        "SELECT * FROM userdailytask WHERE UserId = ? AND TaskId = ?",
        [userId, taskId]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error getting user daily tasks:", error);
      throw error;
    }
  }
}

module.exports = User;
