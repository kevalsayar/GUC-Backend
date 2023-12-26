const { ConstantMembers } = require("../common/members"),
  { ApiError } = require("../utils/ApiError"),
  { UniqueConstraintError, DatabaseError } = require("sequelize");

/**
 * @description Express middleware for handling errors and generating appropriate error responses.
 * @param {Error} err - The error object.
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The next middleware function.
 * @returns {express.Response} The HTTP response with error details.
 */
const errorHandler = (err, req, res, next) => {
  let response = {};

  if (
    err instanceof UniqueConstraintError ||
    err instanceof ReferenceError ||
    err instanceof DatabaseError
  ) {
    response = {
      code: ConstantMembers.STATUS_CODE.INTERNAL_SERVER_ERROR,
      status: ConstantMembers.API_STATUS.FALSE,
      message:
        process.env.NODE_ENV.trim() === "dev"
          ? err.message
          : ConstantMembers.Messages.request.error.internal,
    };
  }

  if (err instanceof ApiError) {
    response = {
      ...err,
      message:
        process.env.NODE_ENV.trim() === "dev"
          ? err.message
          : ConstantMembers.Messages.request.error.internal,
    };
  }

  return res.status(response.code).json(response);
};

module.exports = {
  errorHandler,
};
