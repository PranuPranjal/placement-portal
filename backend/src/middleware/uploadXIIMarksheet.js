const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadXIIMarksheetDir = path.join(__dirname, '../../UploadXIIMarksheet');
if (!fs.existsSync(uploadXIIMarksheetDir)) {
  fs.mkdirSync(uploadXIIMarksheetDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadXIIMarksheetDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'xii-marksheet-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed for XII marksheets'), false);
  }
};

const uploadXIIMarksheet = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024           
  },
  fileFilter: fileFilter
});

module.exports = uploadXIIMarksheet;
