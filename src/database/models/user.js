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

    async fetchTaskDetails(taskId) {
        try {
            const [result] = await this.db.query(
                "SELECT * FROM dailytask WHERE TaskId = ?", [taskId]
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
                "SELECT * FROM dailytask WHERE isDeleted = 0 ORDER BY DifficultyId ASC"
            );
            return result.length > 0 ? result : [];
        } catch (error) {
            console.error(`Error fetching all tasks: ${error}`);
            throw error;
        }
    }


    async acceptTask(userId, taskId, dateTaken) {
        // Check if the task is already accepted by the user
        const checkQuery = `SELECT * FROM userdailytask WHERE UserId = ? AND TaskId = ?`;
        const [existingTasks] = await this.db.query(checkQuery, [userId, taskId]);

        if (existingTasks.length > 0) {
            // Task is already accepted
            return { alreadyAccepted: true };
        }

        // If not accepted, insert the task
        const insertQuery = `
            INSERT INTO userdailytask (UserId, TaskId, DateTaken, Status) 
            VALUES (?, ?, ?, 'Ongoing')
        `;
        const [result] = await this.db.query(insertQuery, [userId, taskId, dateTaken]);
        return { result: result, alreadyAccepted: false };
    }

    async checkTaskAccepted(userId, taskId) {
        const query = "SELECT * FROM userdailytask WHERE UserId = ? AND TaskId = ? AND Status = 'Ongoing'";
        const [results] = await this.db.query(query, [userId, taskId]);
        return results.length > 0; // true if task is accepted
    }

    

    async fetchAcceptedTasks(userId) {
        const query = `
            SELECT udt.*, dt.TaskName, dt.DifficultyId, dt.TaskDescription 
            FROM userdailytask udt
            JOIN dailytask dt ON udt.TaskId = dt.TaskId
            WHERE udt.UserId = ? AND udt.Status = 'Ongoing'
        `;
        const [tasks] = await this.db.query(query, [userId]);
        return tasks;
    }
    
}

module.exports = User;
