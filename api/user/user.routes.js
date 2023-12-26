const router = require("express").Router(),
  { UserHandler } = require("./user.handlers"),
  { reqMiddleware } = require("../middleware/request.middleware"),
  authMiddleware = require("../middleware/auth.middleware"),
  { validationSchemas } = require("./user.validationSchema"),
  { ConstantMembers } = require("../common/members"),
  asyncHandler = require("express-async-handler");

router.get(
  ConstantMembers.ENDPOINTS.USER_ENDPOINTS.GET_USER_DETAILS_BY_UUID,
  [
    authMiddleware().roleAuth,
    reqMiddleware.validatePathParam(validationSchemas.userInfoByUUIDSchema),
  ],
  asyncHandler(UserHandler.fetchUserDetails)
);

router.post(
  ConstantMembers.ENDPOINTS.USER_ENDPOINTS.LOGIN,
  [reqMiddleware.validateReqBody(validationSchemas.loginUserSchema)],
  asyncHandler(UserHandler.userLogin)
);

router.post(
  ConstantMembers.ENDPOINTS.USER_ENDPOINTS.LOGOUT,
  [authMiddleware().roleAuth],
  asyncHandler(UserHandler.userLogout)
);

router.get(
  ConstantMembers.ENDPOINTS.USER_ENDPOINTS.USER_EXISTENCE,
  [reqMiddleware.validatePathParam(validationSchemas.userExistenceCheckSchema)],
  asyncHandler(UserHandler.fetchUserDetails)
);

module.exports = router;
