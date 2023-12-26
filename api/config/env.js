/**
 * @module EnvConfig
 * 
 * @description Environment Configuration Module.
 */

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT,
  RATE_LIMIT: process.env.RATE_LIMIT,
  MAX_REQUESTS: process.env.MAX_REQUESTS,
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DIALECT: process.env.DIALECT,
  ALTER_DB: process.env.ALTER_DB,
  TIME_FORMAT: process.env.TIME_FORMAT,
  MAX_SIZE: process.env.MAX_SIZE,
  ALGORITHM: process.env.ALGORITHM,
  EXPIRES_IN: process.env.EXPIRES_IN,
  FILE_SIZE: process.env.FILE_SIZE,
  IMAGE_UPLOAD: process.env.IMAGE_UPLOAD,
  CERTIFICATE_UPLOAD: process.env.CERTIFICATE_UPLOAD,
  TEMPLATES_PATH: process.env.TEMPLATES_PATH,
  LOGGER_ERROR_PATH: process.env.LOGGER_ERROR_PATH,
  LOGGER_COMBINED_PATH: process.env.LOGGER_COMBINED_PATH,
  MIMETYPES: process.env.MIMETYPES,
  BSCT_JSON_RPC_URL: process.env.BSCT_JSON_RPC_URL,
  GUC_TOKEN_ADDRESS: process.env.GUC_TOKEN_ADDRESS,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  NUM_GUC_TO_TRANSFER: process.env.NUM_GUC_TO_TRANSFER,
};
