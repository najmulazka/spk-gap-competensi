const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Validasi file
const fileFilter = (req, file, cb) => {
  const filetypes = /xlsx|csv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // MIME type yang sesuai
  const mimetypes = /vnd.openxmlformats-officedocument.spreadsheetml.sheet|csv/;
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('File type not allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});

module.exports = upload;
