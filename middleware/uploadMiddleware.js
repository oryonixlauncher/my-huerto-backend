// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Config stockage local (tu peux adapter pour un stockage cloud)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // dossier uploads (à créer)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filter pour limiter les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Solo archivos de imagen o video son permitidos'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

