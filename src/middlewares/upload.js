const multer = require("multer");
const { BabyMonitorError } = require("./errorHandler");

const storage = multer.memoryStorage();

const upload = multer({
  limits: { fileSize: 1024 * 1024 * 10 }, // Max 10MB
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const isMimeTypeAllowed = filetypes.test(file.mimetype);

    if (isMimeTypeAllowed) return cb(null, true);
    else cb(new BabyMonitorError("Only images are allowed", 400));
  },
});

module.exports = { upload };
