import os

# Define the folder structure and backend files
folders = [
    "backend/src",
    "backend/src/routes",
    "backend/src/controllers",
    "backend/src/middleware",
    "backend/src/services",
    "backend/src/utils"
]

files_content = {

    "backend/.env": '''PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/placement"
JWT_SECRET="your_jwt_secret"
''',

    "backend/src/server.js": '''const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
''',

    "backend/src/routes/authRoutes.js": '''const express = require('express');
const { login, signup } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
''',

    "backend/src/routes/studentRoutes.js": '''const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { updateProfile, eligibleCompanies, applyCompany, passCompany } = require('../controllers/studentController');
const router = express.Router();

router.use(authenticateUser);

router.put('/profile', updateProfile);
router.get('/companies', eligibleCompanies);
router.post('/apply/:companyId', applyCompany);
router.post('/pass/:companyId', passCompany);

module.exports = router;
''',

    "backend/src/routes/adminRoutes.js": '''const express = require('express');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const { addCompany, viewUsers } = require('../controllers/adminController');
const router = express.Router();

router.use(authenticateAdmin);

router.post('/company', addCompany);
router.get('/users', viewUsers);

module.exports = router;
''',

    "backend/src/controllers/authController.js": '''const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    });
    res.json({ token: generateToken(user) });
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ token: generateToken(user) });
};
''',

    "backend/src/controllers/studentController.js": '''const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.updateProfile = async (req, res) => {
  const { name, cgpa, branchId } = req.body;
  const userId = req.user.id;
  try {
    const student = await prisma.student.upsert({
      where: { id: userId },
      update: { name, cgpa, branchId },
      create: { id: userId, name, cgpa, branchId }
    });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: 'Could not update profile' });
  }
};

exports.eligibleCompanies = async (req, res) => {
  const userId = req.user.id;
  const student = await prisma.student.findUnique({ where: { id: userId }, include: { branch: true } });
  const companies = await prisma.company.findMany({
    where: {
      cgpaCriteria: { lte: student.cgpa },
      allowedBranches: { some: { branchId: student.branchId } }
    }
  });
  res.json(companies);
};

exports.applyCompany = async (req, res) => {
  const { companyId } = req.params;
  const studentId = req.user.id;
  try {
    const application = await prisma.application.create({
      data: { studentId, companyId }
    });
    res.json(application);
  } catch (err) {
    res.status(400).json({ error: 'Could not apply to company' });
  }
};

exports.passCompany = async (req, res) => {
  const { companyId } = req.params;
  const studentId = req.user.id;
  try {
    const application = await prisma.application.create({
      data: { studentId, companyId, status: 'REJECTED' }
    });
    res.json(application);
  } catch (err) {
    res.status(400).json({ error: 'Could not pass on company' });
  }
};
''',

    "backend/src/controllers/adminController.js": '''const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addCompany = async (req, res) => {
  const { name, role, salary, cgpaCriteria, deadline, description, allowedBranchIds } = req.body;
  try {
    const company = await prisma.company.create({
      data: {
        name, role, salary, cgpaCriteria, deadline: new Date(deadline), description,
        allowedBranches: {
          create: allowedBranchIds.map(branchId => ({ branchId }))
        }
      }
    });
    res.json(company);
  } catch (err) {
    res.status(400).json({ error: 'Could not create company' });
  }
};

exports.viewUsers = async (req, res) => {
  const students = await prisma.student.findMany({ include: { branch: true } });
  res.json(students);
};
''',

    "backend/src/middleware/authMiddleware.js": '''const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (decoded.role !== 'USER') return res.status(403).json({ error: "Forbidden" });
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

exports.authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (decoded.role !== 'ADMIN') return res.status(403).json({ error: "Forbidden" });
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
'''
}

# Create folders
for folder in folders:
    os.makedirs(folder, exist_ok=True)

# Write files
for path, content in files_content.items():
    with open(path, "w") as f:
        f.write(content)

"Backend boilerplate with Prisma, authentication, and standard routes created."
