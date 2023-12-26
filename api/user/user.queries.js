const { ConstantMembers } = require("../common/members");
const { ApiError } = require("../utils/ApiError");
const { UserModel, PersistentTokensModel } = require("./user.model"),
  { v4 } = require("uuid"),
  { HelperFunction } = require("../common/helper"),
  { IMAGE_UPLOAD } = require("../config/env");

const UserQueries = () => {
  /**
   * @description Finds or creates a user record in the database.
   * @param {object} userDetails - The details of the user to be found or created.
   * @returns {Promise<[object, boolean]>} A Promise that resolves to an array containing the user record and a boolean indicating if the user was created.
   */
  const findOrCreateUserRecord = async (userDetails) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await UserModel.findOrCreate({
          where: { wallet_address: userDetails.wallet_address },
          defaults: {
            id: v4(),
            avatarId:
              userDetails.host +
              `${IMAGE_UPLOAD}/` +
              `users/` +
              `${Math.floor(Math.random() * 28) + 1}.png`,
            ...userDetails,
          },
          transaction: transaction,
        })
    );

  /**
   * @description Retrieve a single user from the database based on a specified column and value.
   * @param {string} col - The column by which to search for the user.
   * @param {string} val - The value to search for in the specified column.
   * @returns {Promise<UserModel|null>} A Promise that resolves to the found user or null if not found.
   */
  const getSingleUser = async (col, val) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await UserModel.findOne({
          where: { [col]: val },
          attributes: {
            exclude: ["createdAt", "promotionalEmails", "role", "user_status"],
          },
          transaction,
        })
    );

  /**
   * @description Retrieve all users from the database.
   * @returns {Promise<UserModel[]>} A Promise that resolves to an array of all users.
   */
  const getAllUsers = async () =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await UserModel.findAll({
          attributes: {
            exclude: ["createdAt"],
          },
          order: [["createdAt", "DESC"]],
          transaction,
        })
    );

  /**
   * @description  Update user records in the database for a specified user by UUID.
   * @param {string} id - The UUID of the user to update.
   * @param {string} columnName - The name of the column to update.
   * @param {*} val - The new value to set for the specified column.
   * @returns {Promise<boolean>} A Promise that resolves to true if the update was successful, or false if there was an error.
   */
  const userRecordsUpdate = async (id, columnName, val) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await UserModel.update(
          {
            [columnName]: val,
          },
          {
            where: { id },
          },
          transaction
        )
    );

  return {
    findOrCreateUserRecord,
    getSingleUser,
    getAllUsers,
    userRecordsUpdate,
  };
};

const PersistentTokensQueries = () => {
  /**
   * @description Finds or creates a token record associated with a user.
   * @param {string} token - The JWT token value to associate with the user.
   * @param {string} publicKey - The public key associated with the token.
   * @param {string} userId - The unique identifier of the user.
   * @returns {[object, boolean]} An array containing the created token record and a boolean indicating if it was created.
   */
  const findOrCreateTokenRecord = async (token, publicKey, userId) =>
    await HelperFunction.runTransaction(async (transaction) => {
      const [createTokenResult, created] =
        await PersistentTokensModel.findOrCreate({
          where: { userId },
          defaults: {
            jwt: token,
            publicKey: publicKey,
          },
          transaction: transaction,
        });

      const userResults = await UserModel.findOne({
        where: { id: userId },
        transaction,
      });

      if (!userResults)
        throw new ApiError(
          ConstantMembers.STATUS_CODE.NOT_FOUND,
          ConstantMembers.Messages.request.error["inexistent-resource"]
        );

      await userResults.setPersistent_token(createTokenResult, { transaction });

      return [createTokenResult.dataValues, created];
    });

  /**
   * @description Retrieves the public key associated with a JWT token.
   * @param {string} jwt - The JWT token for which to retrieve the public key.
   * @returns {Promise<string|boolean>} A Promise that resolves to the public key if found, or `false` if not found.
   */
  const getPublicKey = async (jwt) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await PersistentTokensModel.findOne({
          raw: true,
          where: { jwt },
          transaction,
          attributes: ["jwt", "publicKey"],
        })
    );

  /**
   * @description Removes a JWT token record from the database.
   * @param {string} jwt - The JWT token to be removed.
   * @returns {Promise<boolean>} A Promise that resolves to `true` if the token is removed successfully, or `false` if the token is not found or if there's an error during removal.
   */
  const removeToken = async (jwt) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await PersistentTokensModel.destroy({
          where: { jwt },
          transaction,
        })
    );

  return {
    findOrCreateTokenRecord,
    getPublicKey,
    removeToken,
  };
};

module.exports = {
  UserQuery: UserQueries(),
  PersistentTokenQuery: PersistentTokensQueries(),
};
