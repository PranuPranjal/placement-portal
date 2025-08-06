const express = require('express');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const { addCompany, viewUsers } = require('../controllers/adminController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticateAdmin);

router.get('/branches', async (req, res) => {
  const branches = await prisma.branch.findMany();
  res.json(branches);
});

router.post('/company', addCompany);

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

router.get('/users', viewUsers);

module.exports = router;
