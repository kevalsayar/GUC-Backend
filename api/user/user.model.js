const { db } = require("../config/db.config"),
  { DataTypes } = require("sequelize"),
  { ALTER_DB } = require("../config/env"),
  {
    DonationHistoryModel,
  } = require("../donationHistory/donationHistory.model"),
  { ProjectModel } = require("../projects/projects.model");

const UserModel = db.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    wallet_address: DataTypes.STRING,
    carbon_credits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    emailAddress: { type: DataTypes.STRING, unique: true },
    user_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
    },
    avatarId: {
      type: DataTypes.STRING,
    },
    promotionalEmails: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true, createdAt: true, updatedAt: false }
);

const PersistentTokensModel = db.define(
  "persistent_tokens",
  {
    jwt: DataTypes.STRING(500),
    publicKey: DataTypes.STRING(1500),
  },
  {
    timestamps: false,
  }
);

UserModel.hasOne(PersistentTokensModel, { onDelete: "CASCADE" });
PersistentTokensModel.belongsTo(UserModel, { onDelete: "CASCADE" });

UserModel.hasMany(DonationHistoryModel, {
  foreignKey: { name: "userId" },
  onDelete: "CASCADE",
});
DonationHistoryModel.belongsTo(UserModel, {
  foreignKey: { name: "userId" },
  onDelete: "CASCADE",
});

ProjectModel.hasMany(DonationHistoryModel, {
  foreignKey: { name: "projectId" },
  onDelete: "CASCADE",
});
DonationHistoryModel.belongsTo(ProjectModel, {
  foreignKey: { name: "projectId" },
  onDelete: "CASCADE",
});

db.sync({ alter: ALTER_DB == "true" ? true : false });

module.exports = { UserModel, PersistentTokensModel };
