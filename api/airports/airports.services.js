const { AirportQuery } = require("./airports.queries"),
  { ConstantMembers } = require("../common/members"),
  { ApiError } = require("../utils/ApiError"),
  { ApiResponse } = require("../utils/ApiResponse");

/**
 * @namespace AirportServices
 * @description Contains methods for handling airport-related services.
 */
const AirportServices = () => {
  /**
   * @description Service to retrieve airport details based on a provided query object.
   * @param {Object} airportQueryObj - An object containing the airport query parameters.
   * @param {string} airportQueryObj.search - The search string to use for airport name, code, or location search.
   * @returns {Promise<Object>} - Resolves with an object containing airport details and status information.
   * @throws {Error} - Throws an error if there is an internal server error.
   */
  const airportDetails = async (airportQueryObj) => {
    const airportDetails = await AirportQuery.getAirportsBySearch(
      airportQueryObj.search
    );

    if (!airportDetails.length)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.NOT_FOUND,
        ConstantMembers.Messages.request.error["inexistent-resource"]
      );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.Messages.request.success.info,
      airportDetails
    );
  };

  return { airportDetails };
};

module.exports = {
  AirportService: AirportServices(),
};
