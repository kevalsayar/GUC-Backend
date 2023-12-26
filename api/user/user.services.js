const { em } = require("../pubsub"),
  { HelperFunction } = require("../common/helper"),
  { ApiError } = require("../utils/ApiError"),
  { ApiResponse } = require("../utils/ApiResponse"),
  { UserQuery, PersistentTokenQuery } = require("./user.queries"),
  { ConstantMembers } = require("../common/members");

const UserServices = () => {
  /**
   * @description Service to login a particular user, if not have previously.
   * @param {object} userInfo - User information for login.
   * @returns {Promise<ApiResponse>} The API response containing user details and token.
   * @throws {ApiError} If there's an error during login or token creation.
   */
  const login = async (userInfo) => {
    const [createdUserDetails, createUserBool] =
      await UserQuery.findOrCreateUserRecord(userInfo);

    if (createUserBool) em.emit("transfer-BETAGUC", userInfo.wallet_address);

    const { token, publicKey } = await HelperFunction.signAndGet({
      id: createdUserDetails.id,
      wallet_address: createdUserDetails.wallet_address,
      role: createdUserDetails.role,
      user_status: createdUserDetails.user_status,
    });

    const [userLoggedInDetails, createTokenBool] =
      await PersistentTokenQuery.findOrCreateTokenRecord(
        token,
        publicKey,
        createdUserDetails.id
      );

    if (!createTokenBool)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.BAD_REQUEST,
        ConstantMembers.Messages.user["login-error"],
        { uuid: createdUserDetails.id, token: userLoggedInDetails.jwt }
      );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.Messages.user["login-success"],
      { uuid: createdUserDetails.id, token: userLoggedInDetails.jwt }
    );
  };

  /**
   * @description Service to fetch either a particular user's details or all users details.
   * @param {object} userInfo - Criteria for retrieving user details.
   * @returns {Promise<ApiResponse>} The API response containing user details.
   */
  const userDetails = async (userInfo) => {
    let userResults;

    if (userInfo.uuid)
      userResults = await UserQuery.getSingleUser("id", userInfo.uuid);
    else if (userInfo.wallet_address)
      userResults = await UserQuery.getSingleUser(
        "wallet_address",
        userInfo.wallet_address
      );
    else userResults = await UserQuery.getAllUsers();

    if (!userResults)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.NOT_FOUND,
        ConstantMembers.Messages.request.error["inexistent-resource"]
      );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.Messages.request.success.info,
      { userDetails: userResults }
    );
  };

  /**
   * @description Log a user out by removing their persistent token from the database.
   * @param {string} jwt - The JSON Web Token (JWT) to be removed from the database.
   * @returns {Promise<ApiResponse>} A Promise that resolves to an API response indicating the logout status.
   */
  const logout = async (jwt) => {
    await PersistentTokenQuery.removeToken(jwt);

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.Messages.user["logout-success"]
    );
  };

  return {
    userDetails,
    login,
    logout,
  };
};

module.exports = {
  UserService: UserServices(),
};
