const joi = require("joi"),
  search = joi.string().trim().min(3).label("Search Value").messages({
    "any.required": "Search Value is required!",
    "string.min": "Search Value length must be at least 3 characters long!",
    "string.empty": "Search Value is not allowed to be empty!",
  });

/**
 * @module AirportSchemas
 * @description Provides Joi validation schemas for airport-related operations.
 */
const AirportSchemas = () => {
  const getAirportSchema = joi.object({
    search: search.required(),
  });

  return {
    getAirportSchema,
  };
};

module.exports = {
  AirportSchema: AirportSchemas(),
};
