const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder tempat file akan disimpan
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Validasi tipe file yang diperbolehkan
const fileFilter = (req, file, cb) => {
  // Ekstensi yang diizinkan
  const filetypes = /xlsx|csv/; // Hanya izinkan .xlsx dan .csv
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // MIME type yang sesuai
  const mimetypes = /vnd.openxmlformats-officedocument.spreadsheetml.sheet|csv/;
  const mimetype = mimetypes.test(file.mimetype);

  // Jika ekstensi dan mimetype sesuai, izinkan upload
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('File type not allowed')); // Error jika tipe file tidak diizinkan
  }
};

// Konfigurasi multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Batas ukuran file 10 MB
  fileFilter: fileFilter,
});

module.exports = upload;
