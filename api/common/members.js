/**
 * Constant members and configuration settings for the application.
 *
 * @namespace ConstantMembers
 * @property {Object} Messages - Various messages used within the application.
 * @property {Object} STATUS_CODE - HTTP status codes used in the application.
 * @property {Object} API_STATUS - Boolean API status values.
 * @property {Object} ENDPOINTS - API endpoint paths.
 * @property {Object} HTML_TEMPLATES - HTML template names.
 * @property {Object} USER_ROLE - User role constants.
 * @property {Object} ETHERS_WEI_CONSTANTS - Constants related to Ethereum wei conversions.
 */

const ConstantMembers = () => {
  const Messages = {
    request: {
      validationError: {
        "required-req-body":
          "A required request body parameter was not included in the request!",
        "required-query-params":
          "A required query parameter was not included in the request!",
        "required-path-params":
          "A required path parameter was not included in the request!",
      },
      success: {
        created:
          "Request has succeeded and has led to the creation of a resource.",
        info: "The resource has been fetched and is transmitted in the data body.",
        deleted:
          "Request has succeeded and has led to the deletion of a resource.",
        updated:
          "Request has succeeded and has led to the updation of a resource.",
      },
      error: {
        internal:
          "Server encountered an unexpected condition that prevented it from fulfilling the request!",
        "inexistent-resource": "Can not map the specified URl to a resource!",
        "existent-resource": "Duplicate resource are not permitted!",
        unauthorized: "Access denied for requested admin route!",
        blocked: "User blocked, contact administrator for further information!",
      },
      token: {
        "token-not-provided": "JWT was not included in the request!",
        "bearer-token-required":
          "Make sure the request has an Authorization header with a bearer token!",
        "token-not-found":
          "Token not found in the system, please authenticate yourself!",
        "token-expired": "JWT Expired, please login again!",
      },
    },
    image: {
      "image-type-not-supported":
        "Image type is not supported, please try again!",
      "image-not-uploaded": "Image hasn't been uploaded, please try again!",
      "image-size-exceeded": "Image size larger than permitted!",
      "no-input-image": "Please pass an image along with the request!",
    },
    user: {
      "login-success": "Login completed successfully!",
      "login-error": "User already logged in!",
      "logout-success": "Logged out successfully!",
      "logout-error": "User is already logged out!",
    },
    gucToken: {
      "insufficient-tokens":
        "Insufficient GUC Tokens within the contract, contact admin!",
    },
  };

  const STATUS_CODE = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    FORBIDDEN: 413,
    MISDIRECTED_REQUEST: 421,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
  };

  const API_STATUS = {
    TRUE: true,
    FALSE: false,
  };

  const ENDPOINTS = Object.freeze({
    ROOT: "/",
    APIDOCS: "/apidocs",
    V1: "/v1",
    USER_ENDPOINTS: {
      USER: "/user",
      LOGIN: "/login",
      USER_EXISTENCE: "/userExistence/:wallet_address",
      GET_USER_DETAILS_BY_UUID: "/details/:uuid?",
      DELETE: "/delete",
      LOGOUT: "/logout",
    },
    CATEGORY_ENDPOINTS: {
      CATEGORIES: "/categories",
      USER_SPECIFIC_CATEGORIES: "/userCategories/:userId",
    },
    PROJECT_ENDPOINTS: {
      PROJECTS: "/projects",
      PROJECTS_IMAGES: "/images/projects",
    },
    DONATION_ENDPOINTS: {
      DONATIONS: "/donations",
      USER_DONATION_NAME: "/name/:donationId",
      ADD_USER_DONATION_NAME: "/addName",
      FETCH_CERTIFICATE: "/certificate/:donationId",
    },
    AIRPORT_ENDPOINTS: {
      AIRPORTS: "/airports",
    },
  });

  const HTML_TEMPLATES = Object.freeze({
    GUC_DONATION_CERTI: "donationCertificate",
    DEMO_GUC_DONATION_CERTI: "demoDonationCertificate",
  });

  const USER_ROLE = Object.freeze({
    ADMIN: 1,
    USER: 2,
  });

  const ETHERS_WEI_CONSTANTS = {
    FROM_WEI: "formatUnits",
    TO_WEI: "parseUnits",
  };

  return {
    Messages,
    STATUS_CODE,
    API_STATUS,
    ENDPOINTS,
    HTML_TEMPLATES,
    USER_ROLE,
    ETHERS_WEI_CONSTANTS,
  };
};

module.exports = {
  ConstantMembers: ConstantMembers(),
};
