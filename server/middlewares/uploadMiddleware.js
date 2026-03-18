const multer = require('multer');
const path   = require('path');
const { v4: uuidv4 } = require('uuid');

const ALLOWED_TYPES = /jpeg|jpg|png|webp/;
const MAX_SIZE      = 5 * 1024 * 1024; // 5 MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const mimetype = ALLOWED_TYPES.test(file.mimetype);
  const extname  = ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase().slice(1));
  if (mimetype && extname) return cb(null, true);
  cb(new Error('Only JPEG, JPG, PNG, and WEBP images are allowed'));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

module.exports = upload;
