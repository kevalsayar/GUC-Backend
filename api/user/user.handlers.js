const { HelperFunction } = require("../common/helper"),
  { UserService } = require("./user.services");

const UserHandlers = () => {
  /**
   * @description Handler function to fetch user details based on the provided request parameters.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the response is sent.
   */
  const fetchUserDetails = async (req, res) => {
    const response = await UserService.userDetails(req.params);
    res.status(response.code).json(response);
  };

  /**
   * @description Handler function to process user login based on the provided request body.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the response is sent.
   */
  const userLogin = async (req, res) => {
    req.body.host = HelperFunction.host(req);
    const response = await UserService.login(req.body);
    res.status(response.code).json(response);
  };

  /**
   * @description Handler function to process user logout based on the provided authorization token.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the response is sent.
   */
  const userLogout = async (req, res) => {
    const response = await UserService.logout(
      req.headers.authorization.split(" ")[1]
    );
    res.status(response.code).json(response);
  };

  return {
    fetchUserDetails,
    userLogin,
    userLogout,
  };
};

module.exports = {
  UserHandler: UserHandlers(),
};
