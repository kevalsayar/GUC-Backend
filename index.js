const express = require("express"),
  bodyParser = require("body-parser"),
  { PORT, RATE_LIMIT, MAX_REQUESTS } = require("./api/config/env"),
  indexRouter = require("./api/index"),
  path = require("path"),
  helmet = require("helmet"),
  rateLimit = require("express-rate-limit"),
  { serve, setup } = require("swagger-ui-express"),
  swaggerDoc = require("./openapi.json"),
  { logger } = require("./api/config/logger.config"),
  { swaggerOptions } = require("./api/config/swagger.config"),
  { ConstantMembers } = require("./api/common/members"),
  { errorHandler } = require("./api/middleware/error.middleware");

const app = express();

const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT * 60 * 1000,
  max: MAX_REQUESTS,
  standardHeaders: true,
  message: {
    code: ConstantMembers.STATUS_CODE.TOO_MANY_REQUESTS,
    status: ConstantMembers.API_STATUS.FALSE,
    message:
      "Too many requests originated from this IP, please try again after a minute!",
  },
  legacyHeaders: false,
});

app.enable("trust proxy");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(bodyParser.json());

app.use(express.json());

app.get(ConstantMembers.ENDPOINTS.ROOT, (req, res) => {
  res.json({
    project_name: "GUC PORTAL",
    description: "Welcome to Green Universe Coin's API Service!!",
    APIdocs: `${req.get("host")}${ConstantMembers.ENDPOINTS.APIDOCS}`,
  });
});

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(
  ConstantMembers.ENDPOINTS.APIDOCS,
  serve,
  setup(swaggerDoc, swaggerOptions)
);

app.use(ConstantMembers.ENDPOINTS.V1, apiLimiter, indexRouter);

app.use("*", (req, res) => {
  res.status(ConstantMembers.STATUS_CODE.MISDIRECTED_REQUEST).json({
    status: false,
    message: `${req["originalUrl"]} route not found`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}.`);
});
