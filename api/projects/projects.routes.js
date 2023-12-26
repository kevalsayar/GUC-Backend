const router = require("express").Router(),
  { ProjectHandler } = require("./projects.handlers"),
  { reqMiddleware } = require("../middleware/request.middleware"),
  authMiddleware = require("../middleware/auth.middleware"),
  { projectSchemas } = require("./projects.valSchema"),
  { ConstantMembers } = require("../common/members"),
  asyncHandler = require("express-async-handler");

router
  .route(ConstantMembers.ENDPOINTS.ROOT)
  .get(
    [reqMiddleware.validateQueryParam(projectSchemas.getProjectSchema)],
    asyncHandler(ProjectHandler.fetchProjects)
  )
  .post(
    [
      authMiddleware(ConstantMembers.USER_ROLE.ADMIN).roleAuth,
      reqMiddleware.validateQueryParam(projectSchemas.moduleNameSchema),
      reqMiddleware.validateFile(),
      reqMiddleware.validateReqBody(projectSchemas.addProjectSchema),
    ],
    asyncHandler(ProjectHandler.addProjects)
  );

module.exports = router;
