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
          "",
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
        "SELECT * FROM organization JOIN coordinator ON coordinator.OrganizationId = organization.OrganizationId JOIN person ON coordinator.PersonId = person.PersonId WHERE username = ?",
        [coordinatorData.username]
      );
      // Return the user data if found, else return null
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error(`Error fetching user`, error);
      throw error;
    }
  }

  async insertTask(taskData) {
    try {
      const [task] = await this.db.query(
        "INSERT INTO dailytask (DifficultyId, CoordinatorId, TaskName, TaskType, TaskDescription, TaskPoints, Status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          taskData.difficultyId,
          taskData.coordinatorId,
          taskData.taskName,
          taskData.taskType,
          taskData.taskDescription,
          taskData.taskPoints,
          taskData.Status,
        ]
      );
      const insertedTaskId = task.insertId;
      return insertedTaskId;
    } catch (error) {
      console.error(`Error inserting task`, error);
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
    try {
      const [result] = await this.db.query(
        "SELECT * FROM dailytask WHERE CoordinatorId = ?",
        [coordinatorData.coordinatorId]
      );
      return result.length > 0 ? result : null;
    } catch (error) {
      console.error(`Error fetching tasks: ${error}`);
      throw error;
    }
  }

  async deleteTasks(coordinatorData){
    try {
      const [result] = await this.db.query(
        "UPDATE dailytask SET isDeleted = 1 WHERE TaskId = ?",
        [coordinatorData.taskId]
      );
      return result;
    }catch(error){
      console.error(`Error fetching tasks: ${error}`);
      throw error;
    }
  }
}

module.exports = Coordinator;
