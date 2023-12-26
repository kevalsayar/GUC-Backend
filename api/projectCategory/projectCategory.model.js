const { db } = require("../config/db.config"),
  { DataTypes } = require("sequelize"),
  { ProjectModel } = require("../projects/projects.model"),
  fs = require("fs"),
  { ALTER_DB } = require("../config/env");

/**
 * Database model for categories.
 *
 * @typedef {object} CategoryModel
 * @property {number} categoryId - The unique identifier for the category.
 * @property {string} categoryTitle - The title of the category (unique).
 * @property {boolean} categoryStatus - The status of the category (default: true).
 * @property {Date} createdAt - The timestamp when the category was created.
 */
const CategoryModel = db.define(
  "categories",
  {
    categoryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryTitle: {
      type: DataTypes.STRING,
      unique: true,
    },
    categoryStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { timestamps: true, createdAt: true, updatedAt: false }
);

CategoryModel.hasMany(ProjectModel, {
  foreignKey: { name: "categoryId" },
  onDelete: "CASCADE",
});
ProjectModel.belongsTo(CategoryModel, {
  foreignKey: { name: "categoryId" },
  onDelete: "CASCADE",
});

/**
 * Synchronize the database and populate category records if needed.
 */
db.sync({ alter: ALTER_DB == "true" ? true : false }).then(() => {
  CategoryModel.findAndCountAll().then((result) => {
    if (!result.count) {
      CategoryModel.bulkCreate(
        JSON.parse(
          fs.readFileSync(`${process.cwd()}/dbData/categories.json`, "utf8")
        )
      ).then(() => {
        console.log("Category records population's a success.");
      });
    }
  });
});

module.exports = { CategoryModel };
