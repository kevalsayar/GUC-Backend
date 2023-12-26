/**
 * @module JWTConfig
 *
 * @description JWT options for generating and verifying JSON Web Tokens (JWTs).
 */

const { ALGORITHM, EXPIRES_IN } = require("../config/env");

const options = {
  algorithm: ALGORITHM,
  expiresIn: EXPIRES_IN,
};

module.exports = {
  options,
};
