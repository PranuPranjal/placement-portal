const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadXMarksheetDir = path.join(__dirname, '../../UploadXMarksheet');
if (!fs.existsSync(uploadXMarksheetDir)) {
  fs.mkdirSync(uploadXMarksheetDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadXMarksheetDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'xmarksheet-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed for X marksheets'), false);
  }
};

const uploadXMarksheet = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024           
  },
  fileFilter: fileFilter
});

module.exports = uploadXMarksheet;
