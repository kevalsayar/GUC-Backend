const { HelperFunction } = require("../common/helper"),
  { ConstantMembers } = require("../common/members"),
  { FILE_SIZE, IMAGE_UPLOAD } = require("../config/env"),
  { upload } = require("../config/multer.config"),
  asyncHandler = require("express-async-handler"),
  { ApiError } = require("../utils/ApiError");

const requestMiddleware = function () {
  /**
   * @description Validates incoming data against pre-defined schema.
   * @param {Joi.Schema} schema schema to validate the incoming data against.
   * @param {Object} data data to be validated.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {NextFunction} next
   * @returns {void}
   */
  const validate = asyncHandler(async (schema, data, req, res, next) => {
    const { error } = schema.validate(data);
    if (error) {
      if (req.files) {
        const allFiles = Object.values(req.files).flatMap((files) => files);

        await Promise.all(
          allFiles.map((file) => HelperFunction.removeFile(file.path))
        );
      }

      throw new ApiError(
        ConstantMembers.STATUS_CODE.BAD_REQUEST,
        error.message
      );
    }

    next();
  });

  /**
   * @description Validates the incoming Request Body.
   * @param {object} reqBodySchema - The schema to validate the request body against.
   * @param {express.Request} req - The Express request object.
   * @param {express.Response} res - The Express response object.
   * @param {express.NextFunction} next - The next middleware function.
   * @returns {void}
   */
  const validateReqBody = (reqBodySchema) => (req, res, next) =>
    validate(reqBodySchema, req.body, req, res, next);

  /**
   * @description Validates the incoming Query Params.
   * @param {object} queryParamSchema - The schema to validate the query parameters against.
   * @param {express.Request} req - The Express request object.
   * @param {express.Response} res - The Express response object.
   * @param {express.NextFunction} next - The next middleware function.
   * @returns {void}
   */
  const validateQueryParam = (queryParamSchema) => (req, res, next) =>
    validate(queryParamSchema, req.query, req, res, next);

  /**
   * @description Validates the incoming Path Parameters.
   * @param {object} pathParamSchema - The schema to validate the path parameters against.
   * @param {express.Request} req - The Express request object.
   * @param {express.Response} res - The Express response object.
   * @param {express.NextFunction} next - The next middleware function.
   * @returns {void}
   */
  const validatePathParam = (pathParamSchema) => (req, res, next) =>
    validate(pathParamSchema, req.params, req, res, next);

  /**
   * @description Middleware function for validating uploaded files.
   *
   * This middleware uses the 'multer' library to handle file uploads and validates the uploaded files based on specified criteria.
   * It checks for file size and ensures that the uploaded files exist.
   *
   * @returns {Function} - Express middleware function that performs file validation.
   */
  const validateFile = () => async (req, res, next) => {
    upload(req, res, async function (err) {
      if (err) {
        throw new ApiError(ConstantMembers.STATUS_CODE.BAD_REQUEST, err);
      }

      if (!req.files) {
        throw new ApiError(
          ConstantMembers.STATUS_CODE.BAD_REQUEST,
          ConstantMembers.Messages.image["no-input-image"]
        );
      }

      const fileKeys = Object.keys(req.files);
      fileKeys.forEach((fileKey) =>
        req.files[fileKey].forEach((ele) => {
          if (ele.size > FILE_SIZE) {
            throw new ApiError(
              ConstantMembers.STATUS_CODE.PAYLOAD_TOO_LARGE,
              ConstantMembers.Messages.image["image-size-exceeded"]
            );
          }

          req.body[fileKey] =
            HelperFunction.host(req) +
            `${IMAGE_UPLOAD}/` +
            `${req.query.moduleName}/` +
            ele.filename;
        })
      );

      next();
    });
  };

  return {
    validateReqBody,
    validateQueryParam,
    validatePathParam,
    validateFile,
  };
};

module.exports = {
  reqMiddleware: requestMiddleware(),
};
