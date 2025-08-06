const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { updateProfile, eligibleCompanies, applyCompany, passCompany } = require('../controllers/studentController');
const router = express.Router();

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

router.put('/profile', updateProfile);
router.get('/companies', eligibleCompanies);
router.post('/apply/:companyId', applyCompany);
router.post('/pass/:companyId', passCompany);

module.exports = router;
