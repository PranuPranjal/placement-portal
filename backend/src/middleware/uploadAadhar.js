const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadAadharDir = path.join(__dirname, '../../UploadAadhar');
if (!fs.existsSync(uploadAadharDir)) {
  fs.mkdirSync(uploadAadharDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadAadharDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'aadhar-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed for Aadhar'), false);
  }
};

const uploadAadhar = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024           
  },
  fileFilter: fileFilter
});

module.exports = uploadAadhar;
