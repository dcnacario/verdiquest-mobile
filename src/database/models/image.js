const db = require("../database");

class Image {
  constructor(db) {
    this.db = db; // Assign the 'db' object to the instance variable
  }
  async insertImageOrgProfile(fileName, organizationId) {
    try {
      const [row] = await this.db.query(
        "UPDATE organization SET OrganizationImage = ? WHERE OrganizationId = ?",
        [fileName, organizationId]
      );
      const updateProfileOrg = row.affectedrows;
      return updateProfileOrg;
    } catch (error) {
      console.error(`Error inserting Image Org Profile`, error);
      throw error;
    }
  }
  async getOrganizationImage(organizationId) {
    try {
      const [rows] = await this.db.query(
        "SELECT * FROM organization WHERE OrganizationId = ?",
        [organizationId]
      );
      return rows.length > 0 ? rows[0].OrganizationImage : null;
    } catch (error) {
      console.error(`Error retrieving task image:`, error);
      throw error;
    }
  }

  async insertTaskImage(fileName, taskData) {
    try {
      const [task] = await this.db.query(
        "INSERT INTO dailytask (DifficultyId, OrganizationId, TaskImage, TaskName, TaskDescription, TaskDuration, TaskPoints, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          taskData.difficultyId,
          taskData.organizationId,
          fileName,
          taskData.taskName,
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

  async getTaskImage(taskId) {
    try {
      const [rows] = await this.db.query(
        "SELECT * FROM dailytask WHERE taskId = ?",
        [taskId]
      );
      return rows.length > 0 ? rows[0].TaskImage : null;
    } catch (error) {
      console.error(`Error retrieving task image:`, error);
      throw error;
    }
  }

  async updateTaskImage(fileName, taskId) {
    try {
      const [row] = await this.db.query(
        "UPDATE dailytask SET TaskImage = ? WHERE TaskId = ?",
        [fileName, taskId]
      );
      const updateTaskImage = row.affectedrows;
      return updateTaskImage;
    } catch (error) {
      console.error(`Error inserting Image`, error);
      throw error;
    }
  }

  async insertEventImage(fileName, eventData) {
    try {
      const [event] = await this.db.query(
        "INSERT INTO event (OrganizationId, EventName, EventImage, EventDescription, EventVenue, EventDate, EventPoints) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          eventData.organizationId,
          eventData.eventName,
          fileName,
          eventData.eventDescription,
          eventData.eventVenue,
          eventData.eventDate,
          eventData.eventPoints,
        ]
      );
      const insertedEventId = event.insertId;
      return insertedEventId;
    } catch (error) {
      console.error(`Error inserting event`, error);
      throw error;
    }
  }

  async getEventImage(eventId) {
    try {
      const [rows] = await this.db.query(
        "SELECT * FROM event WHERE EventId = ?",
        [eventId]
      );
      return rows.length > 0 ? rows[0].EventImage : null;
    } catch (error) {
      console.error(`Error retrieving event image:`, error);
      throw error;
    }
  }

  async updateEventImage(eventId, filename) {
    try {
      const [result] = await this.db.query(
        "UPDATE event SET EventImage = ? WHERE EventId = ?",
        [filename, eventId]
      );
      return result.affectedRows;
    } catch (error) {
      console.error(`Error updating event image:`, error);
      throw error;
    }
  }
}
module.exports = Image;
