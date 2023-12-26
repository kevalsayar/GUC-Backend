const { generateKeyPair } = require("crypto"),
  fs = require("fs"),
  util = require("util"),
  jwt = require("jsonwebtoken"),
  Handlebars = require("handlebars"),
  { TEMPLATES_PATH } = require("../config/env"),
  { logger } = require("../config/logger.config"),
  { options } = require("../config/jwt.config"),
  path = require("path"),
  { db } = require("../config/db.config"),
  { ApiError } = require("../utils/ApiError"),
  { ConstantMembers } = require("./members");

/**
 * Utility functions for various tasks within the application.
 *
 * @namespace HelperFunction
 * @property {function} signAndGet - Generates a digital signature for data and returns a JWT token.
 * @property {function} verifyToken - Verifies a JWT token using a provided public key.
 * @property {function} getTemplate - Reads and compiles an HTML template using Handlebars.
 * @property {function} loggerError - Logs an error message with file information.
 * @property {function} loggerInfo - Logs an informational message.
 * @property {function} removeFile - Removes a file from the file system.
 * @property {function} host - Generates a base host URL based on a request object.
 * @property {function} toPascalCase - Converts a string to PascalCase.
 */
const HelperFunction = () => {
  /**
   * @description Generates a digital signature for the provided data and returns a JWT token with the signature.
   * @param {Object} data - The data to be signed and included in the JWT token.
   * @returns {Promise<{token: string, publicKey: string}>} - Resolves with an object containing the JWT token and its corresponding public key.
   */
  const signAndGet = async (data) => {
    const { privateKey, publicKey } = await util.promisify(generateKeyPair)(
      "dsa",
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      }
    );

    const jwtToken = jwt.sign(data, privateKey, options);

    return {
      token: jwtToken,
      publicKey: publicKey,
    };
  };

  /**
   * @description Verifies a JSON Web Token (JWT) using a provided public key.
   * @param {string} token - The JWT to be verified.
   * @param {string} publicKey - The public key used to verify the JWT signature.
   * @returns {{status: boolean, payload: object}|{status: boolean, error: Error}} - Returns an object indicating the verification status and either the decoded payload or an error object.
   */
  const verifyToken = (token, publicKey) => {
    try {
      const decoded = jwt.verify(token, publicKey, options);

      return { status: true, payload: decoded };
    } catch (error) {
      logger.error(error.message);

      return { status: false, error: error };
    }
  };

  /**
   * @description Reads and compiles an HTML template file using Handlebars and provided data.
   * @param {string} templateName - The name of the HTML template file to read.
   * @param {Object} data - The data to be used for rendering the template.
   * @returns {Promise<string>} - Resolves with the compiled HTML content.
   */
  const getTemplate = async (templateName, data) =>
    new Promise((resolve, rejects) => {
      fs.readFile(
        path.join(process.cwd(), TEMPLATES_PATH, templateName, "index.html"),
        function (err, fileData) {
          if (!err) {
            const template = fileData.toString();
            resolve(Handlebars.compile(template)(data));
          } else {
            logger.error(err.message);
            rejects(err);
          }
        }
      );
    });

  /**
   * @description Logs an error message including the error's message and the current file name.
   * @param {Error} error - The error object to be logged.
   * @param {string} currentFileName - The name of the current file where the error occurred.
   */
  const loggerError = (error, currentFileName) => {
    logger.error(
      `Error thrown: '${error.message}'. File: '${currentFileName}'`
    );
  };

  /**
   * @description Logs an informational message.
   * @param {Object} info - The information object to be logged.
   * @param {string} info.message - The informational message to be logged.
   */
  const loggerInfo = (info) => {
    logger.info(`${info.message}`);
  };

  /**
   * @description Removes a file from the file system.
   * @param {string} fileToBeRemoved - The path to the file to be removed.
   */
  const removeFile = (fileToBeRemoved) => {
    fs.unlink(fileToBeRemoved, function (err) {
      if (err && err.code == "ENOENT") {
        logger.info("File doesn't exist, won't remove it.");
      } else if (err) {
        logger.error("Error occurred while trying to remove file");
      } else {
        logger.info("File removed.");
      }
    });
  };

  /**
   * @description Generates the base host URL based on the provided request object.
   * @param {Object} request - The request object from which to extract protocol and host information.
   * @returns {string} - The base host URL including protocol and host name.
   */
  const host = (request) => request.protocol + "://" + request.get("host");

  /**
   * @description Converts a string to PascalCase.
   * @param {string} str - The input string to be converted to PascalCase.
   * @returns {string} - The input string converted to PascalCase.
   */
  const toPascalCase = (str) =>
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
      .join(" ");

  /**
   * @description Execute a Sequelize transaction and automatically commit or rollback based on the result of the callback function.
   * @param {Function} transactionCallback The callback function that will be executed within the transaction.
   * @returns {Promise | Boolean} A Promise that resolves when the transaction is successfully committed or rejects if it fails.
   */
  const runTransaction = async (transactionCallback) => {
    const transaction = await db.transaction();

    try {
      const res = await transactionCallback(transaction);

      if (res) await transaction.commit();

      return res;
    } catch (error) {
      await transaction.rollback();
      throw new ApiError(
        error.code
          ? error.code
          : ConstantMembers.STATUS_CODE.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };

  return {
    signAndGet,
    verifyToken,
    getTemplate,
    loggerError,
    loggerInfo,
    removeFile,
    host,
    toPascalCase,
    runTransaction,
  };
};

module.exports = {
  HelperFunction: HelperFunction(),
};
