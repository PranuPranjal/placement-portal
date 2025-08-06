const express = require('express');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const { addCompany, viewUsers } = require('../controllers/adminController');
const { PrismaClient } = require('@prisma/client');
const upload = require('../middleware/upload');
const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticateAdmin);

router.get('/branches', async (req, res) => {
  const branches = await prisma.branch.findMany();
  res.json(branches);
});

// Add company with file upload
router.post('/company', upload.single('companyFile'), async (req, res) => {
  try {
    const { name, role, salary, cgpaCriteria, deadline, description, allowedBranchIds } = req.body;
    const filePath = req.file ? req.file.filename : null;
    
    const company = await prisma.company.create({
      data: {
        name,
        role,
        salary: parseFloat(salary),
        cgpaCriteria: parseFloat(cgpaCriteria),
        deadline: new Date(deadline),
        description,
        filePath, // Store file path
        allowedBranches: {
          create: JSON.parse(allowedBranchIds).map(branchId => ({ branchId: parseInt(branchId) }))
        }
      }
    });
    
    res.json(company);
  } catch (err) {
    console.error('Add company error:', err);
    res.status(400).json({ error: 'Failed to add company' });
  }
});

// Return all companies for admin
router.get('/companies', async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get applicants for a specific company
router.get('/companies/:id/applicants', async (req, res) => {
  try {
    const companyId = parseInt(req.params.id);
    const applications = await prisma.application.findMany({
      where: { companyId },
      include: {
        student: {
          include: { branch: true }
        },
        company: true
      }
    });
    
    const applicants = applications.map(app => ({
      id: app.student.id,
      name: app.student.name,
      email: app.student.email,
      branch: app.student.branch.name,
      cgpa: app.student.cgpa,
      status: app.status,
      appliedAt: app.createdAt || new Date()
    }));
    
    res.json(applicants);
  } catch (err) {
    console.error('Error fetching company applicants:', err);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

router.get('/users', viewUsers);

module.exports = router;
