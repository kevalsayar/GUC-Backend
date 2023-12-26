/**
 * Express router for managing donation history-related endpoints.
 * @module DonationHistoryRouter
 */
const router = require("express").Router(),
  { DonationHandler } = require("./donationHistory.handlers"),
  { reqMiddleware } = require("../middleware/request.middleware"),
  { DonationSchema } = require("./donationHistory.valSchema"),
  { ConstantMembers } = require("../common/members"),
  asyncHandler = require("express-async-handler");

/**
 * Route for fetching donation history or adding a new donation entry based on query parameters or request body.
 * @name GET/POST /donations
 * @function
 * @memberof module:DonationHistoryRouter
 * @inner
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
router
  .route(ConstantMembers.ENDPOINTS.ROOT)
  .get(
    [reqMiddleware.validateQueryParam(DonationSchema.getDonationSchema)],
    asyncHandler(DonationHandler.fetchDonations)
  )
  .post(
    [reqMiddleware.validateReqBody(DonationSchema.addDonationSchema)],
    asyncHandler(DonationHandler.addDonations)
  );

/**
 * Route for fetching the name associated with a donation.
 * @name GET /donations/name/:donationId
 * @function
 * @memberof module:DonationHistoryRouter
 * @inner
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
router.get(
  ConstantMembers.ENDPOINTS.DONATION_ENDPOINTS.USER_DONATION_NAME,
  [reqMiddleware.validatePathParam(DonationSchema.getNameSchema)],
  asyncHandler(DonationHandler.fetchNameForDonation)
);

/**
 * Route for adding a name to a donation.
 * @name POST /donations/addName
 * @function
 * @memberof module:DonationHistoryRouter
 * @inner
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
router.post(
  ConstantMembers.ENDPOINTS.DONATION_ENDPOINTS.ADD_USER_DONATION_NAME,
  [reqMiddleware.validateReqBody(DonationSchema.addNameSchema)],
  asyncHandler(DonationHandler.addNameForDonation)
);

/**
 * Route for fetching a donation certificate.
 * @name GET /donations/certificate/:donationId
 * @function
 * @memberof module:DonationHistoryRouter
 * @inner
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
router.get(
  ConstantMembers.ENDPOINTS.DONATION_ENDPOINTS.FETCH_CERTIFICATE,
  [reqMiddleware.validatePathParam(DonationSchema.getCertificateSchema)],
  asyncHandler(DonationHandler.getCertificate)
);

module.exports = router;
