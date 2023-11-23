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

  async updateUser(userData) {
    try {
      const [user] = await this.db.query(
        "UPDATE user SET VerdiPoints = VerdiPoints + ?, password = ? WHERE UserId = ?",
        [userData.verdiPoints, userData.password, userData.userId]
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

    async fetchEasyTask (){
        try {
            const [result] = await this.db.query("SELECT * FROM dailytask WHERE DifficultyId = 1");
            return result.length > 0 ? result : [];
        } catch (error) {
            console.error(`Error fetching easy tasks: ${error}`);
            throw error;
        };
    }

    async fetchNormalTask (){
        try {
            const [result] = await this.db.query("SELECT * FROM dailytask WHERE DifficultyId = 2");
            return result.length > 0 ? result : [];
        } catch (error) {
            console.error(`Error fetching easy tasks: ${error}`);
            throw error;
        };
    }

    async fetchHardTask (){
        try {
            const [result] = await this.db.query("SELECT * FROM dailytask WHERE DifficultyId = 3");
            return result.length > 0 ? result : [];
        } catch (error) {
            console.error(`Error fetching easy tasks: ${error}`);
            throw error;
        };
    }
}

module.exports = User;
