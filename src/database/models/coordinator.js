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
        "INSERT INTO dailytask (DifficultyId, OrganizationId, TaskName, TaskType, TaskDescription, TaskDuration, TaskPoints, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          taskData.difficultyId,
          taskData.organizationId,
          taskData.taskName,
          taskData.taskType,
          taskData.taskDescription,
          taskData.taskDuration,
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
        "SELECT * FROM dailytask WHERE OrganizationId = ? AND isDeleted = 0",
        [coordinatorData.organizationId]
      );
      return result.length > 0 ? result : null;
    } catch (error) {
      console.error(`Error fetching tasks: ${error}`);
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
        "UPDATE dailytask SET TaskName = ?, TaskType = ?, TaskDescription = ?, TaskPoints = ?, TaskDuration = ? WHERE TaskId = ?",
        [
          taskData.taskName,
          taskData.taskType,
          taskData.taskDescription,
          taskData.taskPoints,
          taskData.taskDuration,
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
        "SELECT * FROM person p JOIN userdailytask u ON p.UserId = u.UserId JOIN dailytask d ON d.TaskId = u.TaskId WHERE u.TaskId = ?",
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
        "UPDATE userdailytask SET Status = ? WHERE UserDailyTaskId = ?",
        [userTask.Status, userTask.userDailyTaskId]
      );

      const userDailyUpdate = usertask.affectedRows;
      return userDailyUpdate;
    } catch (error) {
      console.error(`Error updating user task: ${error}`);
      throw error;
    }
  }

  async createEvent(eventData) {
    try {
      const [event] = await this.db.query(
        "INSERT INTO event (OrganizationId, EventName, EventDescription, EventVenue, EventDate, EventPoints) VALUES (?, ?, ?, ?, ?, ?)",
        [
          eventData.organizationId,
          eventData.eventName,
          eventData.eventDescription,
          eventData.eventVenue,
          eventData.eventDate,
          eventData.eventPoints,
        ]
      );
      const insertedEventId = event.insertId;
      return insertedEventId;
    } catch (error) {
      console.error("Error creating event:", error);
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
      console.error("Error creating event:", error);
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
        "SELECT * FROM person p JOIN participants pt ON p.UserId = pt.UserId JOIN event e ON pt.EventId = e.EventId WHERE pt.EventId = ? AND pt.Status = 'UNVERIFIED'",
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
}

module.exports = Coordinator;
