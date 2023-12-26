const { db } = require("../config/db.config"),
  { DataTypes } = require("sequelize"),
  fs = require("fs"),
  { ALTER_DB } = require("../config/env");

/**
 * Database model for projects.
 *
 * @typedef {object} ProjectModel
 * @property {number} projectId - The unique identifier for the project.
 * @property {string} projectTitle - The title of the project.
 * @property {string} projectBrief - A brief description of the project.
 * @property {string} projectContent - The detailed content of the project.
 * @property {number} totalDonations - The total number of donations received for the project (default: 0).
 * @property {number} amountRaised - The total amount of money raised for the project (default: 0).
 * @property {number} expectedDonationAmount - The expected donation amount for the project.
 * @property {Date} latestDonationTime - The timestamp of the latest donation for the project.
 * @property {Date} publishedDate - The date when the project was published.
 * @property {string} publishedBy - The entity or user who published the project.
 * @property {string} thumbnail - The URL or path to the project's thumbnail image.
 * @property {string} media - The URL or path to the project's media content.
 * @property {string} externalLinkTwitter - The external link to the project on Twitter.
 * @property {string} externalLinkLinkedIn - The external link to the project on LinkedIn.
 */

/**
 * Database model definition for projects.
 *
 * @type {import('sequelize').Model}
 */
const ProjectModel = db.define(
  "project",
  {
    projectId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    projectTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectBrief: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectContent: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    totalDonations: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    amountRaised: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    expectedDonationAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    latestDonationTime: {
      type: DataTypes.DATE,
    },
    publishedDate: {
      type: DataTypes.DATE,
    },
    publishedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
    media: {
      type: DataTypes.STRING,
    },
    externalLinkTwitter: {
      type: DataTypes.STRING,
    },
    externalLinkLinkedIn: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

/**
 * Synchronize the database and populate project records if needed.
 */
db.sync({ alter: ALTER_DB == "true" ? true : false }).then(() => {
  // Check if there are no existing project records.
  ProjectModel.findAndCountAll().then((result) => {
    if (!result.count) {
      // Read project data from a JSON file and bulk insert into the database.
      ProjectModel.bulkCreate(
        JSON.parse(
          fs.readFileSync(`${process.cwd()}/dbData/projects.json`, "utf8")
        )
      ).then(() => {
        console.log("Project records population's a success.");
      });
    }
  });
});

module.exports = { ProjectModel };
