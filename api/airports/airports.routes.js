/**
 * @module AirportRouter
 * @description Defines the Express router for airport-related routes.
 */

const router = require("express").Router(),
  { AirportHandler } = require("./airports.handlers"),
  { reqMiddleware } = require("../middleware/request.middleware"),
  { AirportSchema } = require("./airports.valSchema"),
  { ConstantMembers } = require("../common/members"),
  asyncHandler = require("express-async-handler");

router
  .route(ConstantMembers.ENDPOINTS.ROOT)
  .get(
    [reqMiddleware.validateQueryParam(AirportSchema.getAirportSchema)],
    asyncHandler(AirportHandler.fetchAirport)
  );

module.exports = router;
