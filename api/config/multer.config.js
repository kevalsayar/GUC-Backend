/**
 * @module FileUploadConfig
 *
 * @description File Upload Configuration Module.
 */
const { ConstantMembers } = require("../common/members"),
  { FILE_SIZE, MIMETYPES, IMAGE_UPLOAD } = require("../config/env"),
  multer = require("multer"),
  fs = require("fs"),
  path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.query.moduleName === "projects") {
      if (MIMETYPES.split(", ").includes(file.mimetype)) {
        if (
          !fs.existsSync(
            path.join(process.cwd(), IMAGE_UPLOAD, req.query.moduleName)
          )
        ) {
          fs.mkdirSync(
            path.join(process.cwd(), IMAGE_UPLOAD, req.query.moduleName)
          );
        }
        cb(null, path.join(process.cwd(), IMAGE_UPLOAD, req.query.moduleName));
      }
    } else {
      cb("Module Name query param not found in request URL.");
    }
  },
  filename: (req, file, cb) => {
    if (req.query.moduleName === "projects") {
      cb(
        null,
        req.body.projectTitle +
          "_" +
          file.fieldname +
          "_" +
          Date.now() +
          path.extname(file.originalname)
      );
    } else {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  },
});

const fileFilter = (_req, file, cb) => {
  if (MIMETYPES.split(", ").includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ConstantMembers.Messages.image["image-type-not-supported"]);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: FILE_SIZE,
  },
  fileFilter: fileFilter,
}).fields([
  { name: "media", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

module.exports = {
  upload,
};
