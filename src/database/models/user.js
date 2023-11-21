const BaseModel = require("./BaseModel");

class User extends BaseModel {
  constructor(db) {
    // Accept the 'db' object as a parameter
    super("user");
    this.db = db; // Assign the 'db' object to the instance variable
  }

  async insertUser(userData) {
    try {
      const [result] = await this.db.query(
        `INSERT INTO ${this.tableName} (SubscriptionStatus, VerdiPoints, Email, Password, ProfilePicture, TaskCount, DateRegistered, LastActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Inactive",
          0,
          userData.email,
          userData.password,
          "",
          0,
          new Date(),
          new Date(),
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
          "",
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
      const [result] = await this.db.query(
        "SELECT * FROM user WHERE email = ?",
        [userData.email]
      );
      return result[0];
    } catch (error) {
      console.error(`Error fetching user`, error);
      throw error;
    }
  }
}

module.exports = User;
