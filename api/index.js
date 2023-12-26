const router = require("express").Router();

// Import routes for different parts of the application.
const userRoutes = require("./user/user.routes"),
  categoryRoutes = require("./projectCategory/projectCategory.routes"),
  projectRoutes = require("./projects/projects.routes"),
  donationRoutes = require("./donationHistory/donationHistory.routes"),
  airportRoutes = require("./airports/airports.routes");

// Import middleware for authentication.
const authMiddleware = require("./middleware/auth.middleware");

// Import constant members used for defining endpoints.
const { ConstantMembers } = require("./common/members");

// Use the imported routes and middleware to define the API routes.
router.use(ConstantMembers.ENDPOINTS.USER_ENDPOINTS.USER, userRoutes);
router.use(
  ConstantMembers.ENDPOINTS.CATEGORY_ENDPOINTS.CATEGORIES,
  categoryRoutes
);
router.use(ConstantMembers.ENDPOINTS.PROJECT_ENDPOINTS.PROJECTS, projectRoutes);

// Protect the donation routes with authentication middleware.
router.use(
  ConstantMembers.ENDPOINTS.DONATION_ENDPOINTS.DONATIONS,
  [authMiddleware().roleAuth],
  donationRoutes
);

router.use(ConstantMembers.ENDPOINTS.AIRPORT_ENDPOINTS.AIRPORTS, airportRoutes);

// Export the router for use in the application.
module.exports = router;
