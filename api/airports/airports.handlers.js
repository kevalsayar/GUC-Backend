const { AirportService } = require("./airports.services");

const AirportHandlers = function () {
  /**
   * @description Fetches airport details based on the provided query parameters.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the response is sent.
   */
  const fetchAirport = async (req, res) => {
    const response = await AirportService.airportDetails(req.query);
    res.status(response.code).json(response);
  };

  return { fetchAirport };
};

module.exports = {
  AirportHandler: AirportHandlers(),
};
