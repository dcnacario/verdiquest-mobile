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
}
module.exports = Image;
