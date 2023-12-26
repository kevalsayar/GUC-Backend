const { AirportModel } = require("./airports.model"),
  { HelperFunction } = require("../common/helper"),
  { Op } = require("sequelize");

/**
 * @namespace AirportQueries
 * @description Contains methods for querying airports in a database.
 */
const AirportQueries = () => {
  /**
   * @description Searches for airports based on a provided search string.
   * @param {string} searchString - The search string to use for airport name, code, or location search.
   * @returns {Promise<Array<Object>|boolean>} - Resolves with an array of matching airports (with attributes: name and code) if found; otherwise, resolves with `false`.
   */
  const getAirportsBySearch = async (searchString) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await AirportModel.findAll({
          where: {
            [Op.or]: [
              {
                name: {
                  [Op.like]: `%${searchString}%`,
                },
              },
              {
                code: {
                  [Op.like]: `%${searchString}%`,
                },
              },
              {
                location: {
                  [Op.like]: `%${searchString}%`,
                },
              },
            ],
          },
          attributes: ["name", "code"],
          transaction, 
        })
    );

  return { getAirportsBySearch };
};

module.exports = {
  AirportQuery: AirportQueries(),
};
