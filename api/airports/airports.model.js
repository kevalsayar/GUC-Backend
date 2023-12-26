const { db } = require("../config/db.config"),
  { DataTypes } = require("sequelize"),
  fs = require("fs"),
  { ALTER_DB } = require("../config/env");

const AirportModel = db.define(
  "airports",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

db.sync({ alter: ALTER_DB == "true" ? true : false }).then(() => {
  AirportModel.findAndCountAll().then((result) => {
    if (!result.count) {
      const airportSQL = fs.readFileSync(
        `${process.cwd()}/dbData/airports.sql`,
        "utf8"
      );

      db.query(airportSQL).then(() => {
        console.log("Airport records population's a success.");
      });
    }
  });
});

module.exports = { AirportModel };
