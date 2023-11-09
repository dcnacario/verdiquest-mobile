const BaseModel = require('./BaseModel');

class Coordinator extends BaseModel {

    constructor(db) { // Accept the 'db' object as a parameter
        super('organization');
        this.db = db; // Assign the 'db' object to the instance variable
    }



    async insertOrganization(coordinatorData) {
        try {
            const [result] = await this.db.query(
                `INSERT INTO ${this.tableName} (OrganizationName, OrganizationAddress, OrganizationType) VALUES (?, ?, ?)`,
                [coordinatorData.organizationName, coordinatorData.OrganizationAddress, coordinatorData.OrganizationType]
            );

            const isnertedOrganizationId = result.insertId;

            return isnertedOrganizationId

        } catch (error) {
            console.error(`Error inserting Organization`, error);
            throw error;
        }
    }

    async insertCoordinator(coordinatorData){
        try {
        const [person] = await this.db.query(
            'INSERT INTO person (FirstName, LastName, Initial,  Birthdate, PhoneNumber, Gender, Street, Barangay, City, Province) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [coordinatorData.firstName, coordinatorData.lastName, coordinatorData.middleInitial, '', coordinatorData.phoneNumber, coordinatorData.gender, coordinatorData.street, coordinatorData.barangay, coordinatorData.city, coordinatorData.province]
        );

        const insertedPersonId = person.insertId;

        const [coordinator] = await this.db.query(
            'INSERT INTO coordinator (OrganizationId, PersonId, Username,  Password) VALUES (?, ?, ?, ?)',
            [coordinatorData.organizationId, insertedPersonId, coordinatorData.username, coordinatorData.password]
        );
        const coordinatorInsertId = coordinator.insertId;
        
        return coordinatorInsertId;
    } catch (error) {
        console.error(`Error inserting user`, error);
        throw error;
    }
    }

    async fetchUser(coordinatorData){
        try {
            const [result] = await this.db.query("SELECT * FROM coordinator WHERE username = ? AND password = ?",
            [coordinatorData.username, coordinatorData.password]);
            return result[0];
        } catch(error) {
            console.error(`Error fetching user`, error);
            throw error;    
        }
    }
}

module.exports = Coordinator;
