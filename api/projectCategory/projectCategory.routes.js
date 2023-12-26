const router = require("express").Router(),
  { CategoryHandler } = require("./projectCategory.handlers"),
  { reqMiddleware } = require("../middleware/request.middleware"),
  authMiddleware = require("../middleware/auth.middleware"),
  { categorySchemas } = require("./projectCategory.valSchema"),
  { ConstantMembers } = require("../common/members"),
  asyncHandler = require("express-async-handler");

router
  .route(ConstantMembers.ENDPOINTS.ROOT)
  .get(asyncHandler(CategoryHandler.fetchAllCategory))
  .post(
    [
      authMiddleware(ConstantMembers.USER_ROLE.ADMIN).roleAuth,
      reqMiddleware.validateReqBody(categorySchemas.addCategorySchema),
    ],
    asyncHandler(CategoryHandler.addCategory)
  );

router.get(
  ConstantMembers.ENDPOINTS.CATEGORY_ENDPOINTS.USER_SPECIFIC_CATEGORIES,
  [
    [authMiddleware().roleAuth],
    reqMiddleware.validatePathParam(categorySchemas.getUserCategorySchema),
  ],
  asyncHandler(CategoryHandler.fetchCategoryForUser)
);

module.exports = router;
