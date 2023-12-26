const { ApiError } = require("../utils/ApiError"),
  { PersistentTokenQuery } = require("../user/user.queries"),
  { HelperFunction } = require("../common/helper"),
  { ConstantMembers } = require("../common/members"),
  asyncHandler = require("express-async-handler");

const authMiddleware = (requiredRole = null) => {
  /**
   * @description Middleware function to authenticate users based on role using JSON Web Tokens (JWT).
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   * @returns {Promise<void>} - Resolves if authentication is successful; otherwise, an error response is sent.
   * @throws {Error} - Throws an error if there is an internal server error.
   */
  const roleAuth = asyncHandler(async (req, res, next) => {
    if (!req.headers.authorization)
      throwUnauthorizedError("token-not-provided");

    const jwtToken = req.headers.authorization;

    if (!jwtToken.includes("Bearer"))
      throwUnauthorizedError("bearer-token-required");

    const persistentToken = await PersistentTokenQuery.getPublicKey(
      jwtToken.split(" ")[1]
    );

    if (!persistentToken) throwUnauthorizedError("token-not-found");

    const tokenRes = HelperFunction.verifyToken(
      persistentToken.jwt,
      persistentToken.publicKey
    );

    if (!tokenRes.status) {
      if (await PersistentTokenQuery.removeToken(persistentToken.jwt))
        throwUnauthorizedError(tokenRes.error.message);
    }

    if (requiredRole && tokenRes.payload.role !== requiredRole)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.FORBIDDEN,
        ConstantMembers.Messages.request.error.unauthorized
      );

    next();
  });

  const throwUnauthorizedError = (errorMessage) => {
    throw new ApiError(
      ConstantMembers.STATUS_CODE.UNAUTHORIZED,
      ConstantMembers.Messages.request.token[errorMessage]
    );
  };

  return {
    roleAuth,
  };
};

module.exports = authMiddleware;
