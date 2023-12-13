const BaseModel = require("./BaseModel");

class Coordinator extends BaseModel {
  constructor(db) {
    // Accept the 'db' object as a parameter
    super("organization");
    this.db = db; // Assign the 'db' object to the instance variable
  }

  async insertOrganization(coordinatorData) {
    try {
      const [result] = await this.db.query(
        "INSERT INTO organization (OrganizationName, OrganizationAddress, OrganizationType) VALUES (?, ?, ?)",
        [
          coordinatorData.organizationName,
          coordinatorData.organizationAddress,
          coordinatorData.organizationType,
        ]
      );

      const insertedOrganizationId = result.insertId;

      return insertedOrganizationId;
    } catch (error) {
      console.error(`Error inserting Organization`, error);
      throw error;
    }
  }

  async getLastInsertedOrganizationId() {
    try {
      const [rows] = await this.db.query("SELECT LAST_INSERT_ID() as lastId");
      return rows[0].lastId;
    } catch (error) {
      console.error("Error getting last inserted organization ID", error);
      throw error;
    }
  }

  async insertCoordinator(coordinatorData) {
    try {
      const [person] = await this.db.query(
        "INSERT INTO person (FirstName, LastName, Initial,  Birthdate, PhoneNumber, Gender, Street, Barangay, City, Province) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          coordinatorData.firstName,
          coordinatorData.lastName,
          coordinatorData.middleInitial,
          coordinatorData.birthDate,
          coordinatorData.phoneNumber,
          coordinatorData.gender,
          coordinatorData.street,
          coordinatorData.barangay,
          coordinatorData.city,
          coordinatorData.province,
        ]
      );

      const insertedPersonId = person.insertId;

      const [coordinator] = await this.db.query(
        "INSERT INTO coordinator (OrganizationId, PersonId, Username,  Password) VALUES (?, ?, ?, ?)",
        [
          coordinatorData.organizationId,
          insertedPersonId,
          coordinatorData.username,
          coordinatorData.password,
        ]
      );
      const coordinatorInsertId = coordinator.insertId;

      return coordinatorInsertId;
    } catch (error) {
      console.error(`Error inserting user`, error);
      throw error;
    }
  }

  async fetchUser(coordinatorData) {
    try {
      const [result] = await this.db.query(
        "SELECT * FROM organization JOIN coordinator ON coordinator.OrganizationId = organization.OrganizationId JOIN person ON coordinator.PersonId = person.PersonId WHERE Username = ?",
        [coordinatorData.username]
      );
      // Return the user data if found, else return null
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error(`Error fetching user`, error);
      throw error;
    }
  }

  async fetchUserByCoordinatorId(coordinatorData) {
    try {
      const [result] = await this.db.query(
        "SELECT * FROM organization JOIN coordinator ON coordinator.OrganizationId = organization.OrganizationId JOIN person ON coordinator.PersonId = person.PersonId WHERE CoordinatorId = ?",
        [coordinatorData.coordinatorId]
      );
      // Return the user data if found, else return null
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error(`Error fetching user`, error);
      throw error;
    }
  }

  async getUserByUsername(coordinatorData) {
    try {
      const [row] = await this.db.query(
        "SELECT * FROM coordinator WHERE Username = ?",
        [coordinatorData.userName]
      );
      return row.length > 0 ? row[0] : [];
    } catch (error) {
      console.error(`Error fetching user`, error);
      throw error;
    }
  }

  async fetchDifficulty() {
    try {
      const [result] = await this.db.query("SELECT * FROM difficulty");
      return result.length > 0 ? result : null;
    } catch (error) {
      console.error(`Error fetching difficulty table: ${error}`);
      throw error;
    }
  }

  async fetchTasks(coordinatorData) {
    if (!coordinatorData || !coordinatorData.organizationId) {
      throw new Error("Invalid coordinator data: organizationId is required");
    }

    const organizationId = coordinatorData.organizationId;

    try {
      const [result] = await this.db.query(
        "SELECT * FROM dailytask dt JOIN difficulty d ON dt.DifficultyId = d.DifficultyId WHERE dt.OrganizationId = ? AND dt.isDeleted = 0",
        [organizationId]
      );

      return result.length > 0 ? result : [];
    } catch (error) {
      console.error(
        `Error fetching tasks for OrganizationId ${organizationId}: ${error}`
      );
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
  }

  async getFileNameForTask(taskId) {
    try {
      const [rows] = await this.db.query(
        "SELECT TaskImage FROM dailytask WHERE TaskId= ?",
        [taskId]
      );
      return rows.length > 0 ? rows[0].TaskImage : null;
    } catch (error) {
      console.error(`Error retrieving task image:`, error);
      throw error;
    }
  }

  async deleteTasks(coordinatorData) {
    try {
      const [result] = await this.db.query(
        "UPDATE dailytask SET isDeleted = 1 WHERE TaskId = ?",
        [coordinatorData.taskId]
      );
      return result;
    } catch (error) {
      console.error(`Error deleting tasks: ${error}`);
      throw error;
    }
  }

  async updateTask(taskData) {
    try {
      const [task] = await this.db.query(
        "UPDATE dailytask SET TaskName = ?, TaskDescription = ?, TaskPoints = ?, TaskDuration = ?, DifficultyId = ? WHERE TaskId = ?",
        [
          taskData.taskName,
          taskData.taskDescription,
          taskData.taskPoints,
          taskData.taskDuration,
          taskData.difficultyId,
          taskData.taskId,
        ]
      );
      const taskUpdate = task.affectedRows;
      return taskUpdate;
    } catch (error) {
      console.error(`Error updating task: ${error}`);
      throw error;
    }
  }

  async fetchUserTasks(taskData) {
    try {
      const [result] = await this.db.query(
        "SELECT * FROM person p JOIN user us ON p.UserId = us.UserId JOIN userdailytask u ON us.UserId = u.UserId JOIN dailytask d ON d.TaskId = u.TaskId WHERE u.TaskId = ?",
        [taskData.taskId]
      );
      return result.length > 0 ? result : null;
    } catch (error) {
      console.error(`Error fetching user tasks table: ${error}`);
      throw error;
    }
  }

  async updateUserDailyTask(userTask) {
    try {
      const [usertask] = await this.db.query(
        "UPDATE userdailytask SET TaskStatus = ? WHERE UserDailyTaskId = ?",
        [userTask.Status, userTask.userDailyTaskId]
      );

      const userDailyUpdate = usertask.affectedRows;
      return userDailyUpdate;
    } catch (error) {
      console.error(`Error updating user task: ${error}`);
      throw error;
    }
  }

  async fetchEvent(eventData) {
    try {
      const [result] = await this.db.query(
        "SELECT * FROM event WHERE OrganizationId = ?",
        [eventData.organizationId]
      );
      return result.length > 0 ? result : null;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  }

  async updateEvent(eventData) {
    try {
      const [event] = await this.db.query(
        "UPDATE event SET EventName = ?, EventDescription = ?, EventVenue = ?, EventDate = ?, EventPoints = ? WHERE EventId = ?",
        [
          eventData.eventName,
          eventData.eventDescription,
          eventData.eventVenue,
          eventData.eventDate,
          eventData.eventPoints,
          eventData.eventId,
        ]
      );
      const eventUpdate = event.affectedRows;
      return eventUpdate;
    } catch (error) {
      console.error(`Error updating task: ${error}`);
      throw error;
    }
  }

  async deleteEvent(eventData) {
    try {
      const [result] = await this.db.query(
        "DELETE FROM event WHERE EventId = ?",
        [eventData.eventId]
      );
      return result;
    } catch (error) {
      console.error(`Error deleting tasks: ${error}`);
      throw error;
    }
  }

  async fetchParticipants(eventData) {
    try {
      const [result] = await this.db.query(
        "SELECT * FROM person p JOIN participants pt ON p.UserId = pt.UserId JOIN event e ON pt.EventId = e.EventId INNER JOIN user u ON u.UserId = pt.UserID  WHERE pt.EventId = ? AND pt.Status = 'UNVERIFIED'",
        [eventData.eventId]
      );
      return result.length > 0 ? result : null;
    } catch (error) {
      console.error(`Error fetching participants: ${error}`);
      throw error;
    }
  }

  async fetchParticipantsVerified(eventData) {
    try {
      const [result] = await this.db.query(
        "SELECT * FROM person p JOIN participants pt ON p.UserId = pt.UserId JOIN event e ON pt.EventId = e.EventId WHERE pt.EventId = ? AND pt.Status = 'VERIFIED'",
        [eventData.eventId]
      );
      return result.length > 0 ? result : null;
    } catch (error) {
      console.error(`Error fetching participants: ${error}`);
      throw error;
    }
  }

  async fetchTaskTakers(taskData) {
    try {
      const [rows] = await this.db.query(
        "SELECT COUNT(*) as totalTakers FROM userdailytask WHERE TaskId = ?",
        [taskData.taskId]
      );

      if (!rows || rows.length === 0) {
        return 0; // Return 0 if no rows are returned
      }

      const count = rows[0].totalTakers; // Access the count from the first row
      return count;
    } catch (error) {
      console.error(`Error fetching total takers: ${error}`);
      throw error;
    }
  }

  async fetchUserTaskSelected(taskData) {
    try {
      const [rows] = await this.db.query(
        "SELECT COUNT(*) as totalTakers FROM userdailytask WHERE TaskId = ? AND TaskStatus = 'Ongoing'",
        [taskData.taskId]
      );

      if (!rows || rows.length === 0) {
        return 0; // Return 0 if no rows are returned
      }

      const count = rows[0].totalTakers; // Access the count from the first row
      return count;
    } catch (error) {
      console.error(`Error fetching total takers: ${error}`);
      throw error;
    }
  }

  async updateParticipant(participantData) {
    try {
      const [participant] = await this.db.query(
        "UPDATE participants SET Status = ? WHERE ParticipantId = ?",
        [participantData.Status, participantData.participantId]
      );

      const participantUpdate = participant.affectedRows;
      return participantUpdate;
    } catch (error) {
      console.error(`Error updating participant: ${error}`);
      throw error;
    }
  }

  async fetchCountParticipants(eventData) {
    try {
      const [rows] = await this.db.query(
        "SELECT COUNT(*) as totalParticipants FROM participants WHERE EventId = ?",
        [eventData.eventId]
      );

      if (!rows || rows.length === 0) {
        return 0; // Return 0 if no rows are returned
      }

      const count = rows[0].totalParticipants; // Access the count from the first row
      return count;
    } catch (error) {
      console.error(`Error fetching number of participants: ${error}`);
      throw error;
    }
  }

  async updateCoordinator(coordinatorData) {
    try {
      const [coordinator] = await this.db.query(
        "UPDATE coordinator SET Username = ?, Password = ?  WHERE CoordinatorId = ?",
        [
          coordinatorData.userName,
          coordinatorData.newPassword,
          coordinatorData.coordinatorId,
        ]
      );

      const [person] = await this.db.query(
        "UPDATE person SET FirstName = ?, Initial = ?, LastName = ?, Birthdate = ?, PhoneNumber = ?, Gender = ?, Street = ?, Barangay = ?, City = ?, Province = ? WHERE PersonId = ?",
        [
          coordinatorData.firstName,
          coordinatorData.middleInitial,
          coordinatorData.lastName,
          coordinatorData.birthDate,
          coordinatorData.phoneNumber,
          coordinatorData.gender,
          coordinatorData.street,
          coordinatorData.barangay,
          coordinatorData.city,
          coordinatorData.province,
          coordinatorData.personId,
        ]
      );
      const coordinatorUpdate = person.affectedRows;
      return coordinatorUpdate;
    } catch (error) {
      console.error(`Error updating coordinator: ${error}`);
      throw error;
    }
  }

  async fetchCoordinator(coordinatorData) {
    try {
      const [row] = await this.db.query(
        "SELECT * FROM coordinator username = ?",
        [coordinatorData.username]
      );
      // Return the user data if found, else return null
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error(`Error fetching user`, error);
      throw error;
    }
  }

  async updateOrganization(organizationData) {
    try {
      const [organization] = await this.db.query(
        "UPDATE organization  SET OrganizationImage = ?, OrganizationName = ?, OrganizationAddress = ?, OrganizationType = ? WHERE OrganizationId = ?",
        [
          organizationData.orgImage,
          organizationData.orgName,
          organizationData.orgAddress,
          organizationData.orgType,
          organizationData.orgId,
        ]
      );
      const organizationUpdate = organization.affectedRows;
      return organizationUpdate;
    } catch (error) {
      console.error(`Error updating organization: ${error}`);
      throw error;
    }
  }

  async getUsersByOrg(organizationData) {
    try {
      const [organization] = await this.db.query(
        "SELECT * FROM user u JOIN person p ON u.UserId = p.UserId WHERE OrganizationId = ?",
        [organizationData.orgId]
      );
      return organization.length > 0 ? organization : null;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async removeUserFromOrg(userData) {
    try {
      const [row] = await this.db.query(
        "UPDATE user SET OrganizationId = NULL WHERE UserId = ?",
        [userData.userId]
      );
      return row;
    } catch (error) {
      console.error(`Error removing the member!: ${error}`);
      throw error;
    }
  }

  async deleteOrganization(organizationData) {
    try {
      const [row] = await this.db.query(
        "DELETE FROM organization WHERE OrganizationId = ?",
        [organizationData.orgId]
      );
      return row;
    } catch (error) {
      console.error(`Error removing the member!: ${error}`);
      throw error;
    }
  }

  async fetchProduct(productData) {
    try {
      const [products] = await this.db.query(
        "SELECT * FROM products WHERE OrganizationId = ?",
        [productData.organizationId]
      );
      return products.length > 0 ? products : null;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  async updateProduct(productData) {
    try {
      const [products] = await this.db.query(
        "UPDATE products  SET ProductName = ?, ProductDescription = ?, ProductSize = ?, ProductQuantity = ?, PointsRequired = ? WHERE ProductId = ?",
        [
          productData.productName,
          productData.productDescription,
          productData.productSize,
          productData.productQuantity,
          productData.pointsRequired,
          productData.productId,
        ]
      );
      const productUpdate = products.affectedRows;
      return productUpdate;
    } catch (error) {
      console.error(`Error updating organization: ${error}`);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const [result] = await this.db.query(
        "DELETE FROM products WHERE ProductId = ?",
        [productId]
      );
      return result;
    } catch (error) {
      console.error(`Error deleting product: ${error}`);
      throw error;
    }
  }

  async getFileNameForProduct(productId) {
    try {
      const [rows] = await this.db.query(
        "SELECT ProductImage FROM products WHERE ProductId= ?",
        [productId]
      );
      return rows.length > 0 ? rows[0].ProductImage : null;
    } catch (error) {
      console.error(`Error retrieving product image:`, error);
      throw error;
    }
  }

  async fetchCoordinators(organizationId) {
    try {
      const [result] = await this.db.query(
        "SELECT * FROM coordinator c JOIN person p ON c.PersonId = p.PersonId WHERE OrganizationId = ? AND CoordinatorId  ",
        [organizationId]
      );
      return result;
    } catch (error) {
      console.error(`Error fetching coordinator: ${error}`);
      throw error;
    }
  }

  async updateTaskLimit(taskLimit) {
    try {
      const sql =
        "UPDATE organization SET EasyLimit = ?, ModerateLimit = ?, HardLimit = ?, ChallengingLimit = ?, ExpertLimit = ? WHERE OrganizationId = ?";
      const [result] = await this.db.query(sql, [
        taskLimit.EasyLimit,
        taskLimit.ModerateLimit,
        taskLimit.HardLimit,
        taskLimit.ChallengingLimit,
        taskLimit.ExpertLimit,
        taskLimit.OrganizationId,
      ]);
      const task = result.affectedRows;
      return task;
    } catch (error) {
      console.error(`Error updating task limit: ${error}`);
      throw error;
    }
  }

  async insertSubscription(subscriptionData) {
    try {
      const sql =
        "INSERT INTO subscription (OrganizationId, Status, SubscriptionEnd) VALUES (?,?,?)";
      const [result] = await this.db.query(sql, [
        subscriptionData.OrganizationId,
        subscriptionData.Status,
        subscriptionData.SubscriptionEnd,
      ]);
      const insertedSubscriptionId = result.insertId;

      return insertedSubscriptionId;
    } catch (error) {
      console.error(`Error inserting Subscription`, error);
      throw error;
    }
  }

  async updateSubscriptionStatus(Status, lastInsertedId) {
    try {
      const sql = "UPDATE subscription SET Status = ? WHERE SubscriptionId = ?";
      const [result] = await this.db.query(sql, [Status, lastInsertedId]);
      const subscriptionUpdate = result.affectedRows;
      return subscriptionUpdate;
    } catch (error) {
      console.error(`Error updating Subscription`, error);
      throw error;
    }
  }

  async updateOrganizationSubscriptionStatus(Status, OrganizationId) {
    try {
      const sql =
        "UPDATE organization SET SubscriptionStatus = ? WHERE OrganizationId = ?";
      const [result] = await this.db.query(sql, [Status, OrganizationId]);
      const orgSubscription = result.affectedRows;
      return orgSubscription;
    } catch (error) {
      console.error(`Error updating Subscription`, error);
      throw error;
    }
  }

  async insertSubscriptionTransaction(subscriptionTransactionData) {
    try {
      const sql =
        "INSERT INTO subscriptiontransaction (SubscriptionId, SubscriptionCost, ModeOfTransaction,SubscriptionDate) VALUES (?,?,?,?)";
      const [result] = await this.db.query(sql, [
        subscriptionTransactionData.SubscriptionId,
        subscriptionTransactionData.SubscriptionCost,
        subscriptionTransactionData.ModeOfTransaction,
        subscriptionTransactionData.SubscriptionDate,
      ]);
      const insertedSubscriptionId = result.insertId;

      return insertedSubscriptionId;
    } catch (error) {
      console.error(`Error inserting Subscription Transaction`, error);
      throw error;
    }
  }

  async fetchSubscription(orgId){
    try {
      const sql = "SELECT * FROM subscription WHERE OrganizationId = ?";
      const [result] = await this.db.query(sql, [orgId]);
      return result.length > 0 ? result : null;
    }catch(error){
      console.error(`Error fetching subscription`, error);
      throw error;
    }
  }
}

module.exports = Coordinator;
