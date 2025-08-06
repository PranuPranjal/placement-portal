const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { updateProfile, eligibleCompanies, applyCompany, passCompany } = require('../controllers/studentController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Create upload directories
const createUploadDirs = () => {
  const dirs = ['UploadCV', 'UploadPhoto', 'UploadAadhar', 'UploadUGMarksheet', 'UploadXMarksheet', 'UploadXIIMarksheet'];
  dirs.forEach(dir => {
    const dirPath = path.join(__dirname, `../../${dir}`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};
createUploadDirs();

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    switch (file.fieldname) {
      case 'cv':
        uploadPath = path.join(__dirname, '../../UploadCV');
        break;
      case 'photo':
        uploadPath = path.join(__dirname, '../../UploadPhoto');
        break;
      case 'aadhar':
        uploadPath = path.join(__dirname, '../../UploadAadhar');
        break;
      case 'ugMarksheet':
        uploadPath = path.join(__dirname, '../../UploadUGMarksheet');
        break;
      case 'xMarksheet':
        uploadPath = path.join(__dirname, '../../UploadXMarksheet');
        break;
      case 'xiiMarksheet':
        uploadPath = path.join(__dirname, '../../UploadXIIMarksheet');
        break;
      default:
        uploadPath = path.join(__dirname, '../../uploads');
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = file.fieldname === 'photo' ? 'photo' : 
                  file.fieldname === 'aadhar' ? 'aadhar' :
                  file.fieldname === 'ugMarksheet' ? 'ug-marksheet' :
                  file.fieldname === 'xMarksheet' ? 'x-marksheet' :
                  file.fieldname === 'xiiMarksheet' ? 'xii-marksheet' : 'cv';
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photo') {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for photos'), false);
    }
  } else {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
    }
  }
};

// Configure multer for multiple files
const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
}).fields([
  { name: 'cv', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 },
  { name: 'ugMarksheet', maxCount: 1 },
  { name: 'xMarksheet', maxCount: 1 },
  { name: 'xiiMarksheet', maxCount: 1 }
]);

const uploadCV = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '../../UploadCV'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `cv-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    if (allowedTypes.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files allowed'), false);
    }
  }
});

router.use(authenticateUser);

// Get student profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const prisma = req.app.get('prisma') || require('@prisma/client').PrismaClient ? new (require('@prisma/client').PrismaClient)() : null;
    if (!prisma) throw new Error('Prisma client not found');
    const student = await prisma.student.findUnique({
      where: { id: userId },
      include: { branch: true }
    });
    res.json(student);
  } catch (err) {
    console.error('Error fetching student profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get applied companies
router.get('/applied', async (req, res) => {
  try {
    const userId = req.user.id;
    const prisma = req.app.get('prisma') || require('@prisma/client').PrismaClient ? new (require('@prisma/client').PrismaClient)() : null;
    if (!prisma) throw new Error('Prisma client not found');
    const applications = await prisma.application.findMany({
      where: { studentId: userId },
      include: { company: true }
    });
    const applied = applications.map(a => ({ name: a.company.name, status: a.status }));
    res.json(applied);
  } catch (err) {
    console.error('Error fetching applied companies:', err);
    res.status(500).json({ error: 'Failed to fetch applied companies' });
  }
});

router.put('/profile', uploadMultiple, updateProfile);
router.get('/companies', eligibleCompanies);
router.post('/apply/:companyId', uploadCV.single('cv'), applyCompany);
router.post('/pass/:companyId', passCompany);

module.exports = router;
