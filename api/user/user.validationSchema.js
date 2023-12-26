const joi = require("joi"),
  uuid = joi.string().guid({ version: "uuidv4" }).label("User UUID").messages({
    "any.required": "User UUID is a required parameter!",
    "string.guid": "User ID is not a valid UUID!",
  }),
  wallet_address = joi
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .label("Ethereum Wallet Address")
    .messages({
      "any.required": "An Ethereum Wallet Address is required!",
      "string.pattern.base": "Wallet Address is not a valid Ethereum address!",
    }),
  emailAddress = joi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ["com", "net", "org", "in", "uk", "au", "de", "ua", "ru"],
      },
    })
    .messages({
      "string.email": "Email Address is not a valid one!",
    }),
  promotionalEmails = joi.boolean().label("Promotional Emails").messages({
    "boolean.base": "Promotional Emails is an invalid boolean value!",
  });

/**
 * Define validation schemas for user-related data.
 *
 * @function
 * @name valSchemas
 * @returns {object} An object containing various validation schemas for user data.
 */
const valSchemas = () => {
  const baseUserSchema = {
    wallet_address: wallet_address.required(),
  };

  const loginUserSchema = joi.object({
    ...baseUserSchema,
    emailAddress: emailAddress,
    promotionalEmails: promotionalEmails,
  });

  const userInfoByUUIDSchema = joi.object({
    uuid: uuid,
  });

  const userExistenceCheckSchema = joi.object(baseUserSchema);

  return {
    loginUserSchema,
    userInfoByUUIDSchema,
    userExistenceCheckSchema,
  };
};

module.exports = {
  validationSchemas: valSchemas(),
};
