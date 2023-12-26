const { db } = require("../config/db.config"),
  { DataTypes } = require("sequelize"),
  { ALTER_DB } = require("../config/env");

const DonationHistoryModel = db.define(
  "donation_history",
  {
    donationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    donationAmount: {
      type: DataTypes.INTEGER,
    },
    donationTxHash: {
      type: DataTypes.STRING,
      unique: true,
    },
    nameOnCertificate: {
      type: DataTypes.STRING,
    },
    certificateId: {
      type: DataTypes.UUID,
      unique: true,
    },
    certificateCreationAt: {
      type: DataTypes.DATEONLY,
    },
  },
  { timestamps: true, createdAt: true, updatedAt: false }
);

db.sync({ alter: ALTER_DB == "true" ? true : false });

module.exports = { DonationHistoryModel };
