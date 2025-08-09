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

// Add company with file upload - use controller function
router.post('/company', upload.single('companyFile'), addCompany);

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
      cvPath: app.student.cvPath,
      ugMarksheetPath: app.student.ugMarksheetPath,
      xiiMarksheetPath: app.student.xiiMarksheetPath,
      xMarksheetPath: app.student.xMarksheetPath,
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

// Aggregated statistics for admin dashboard
router.get('/stats', async (req, res) => {
  try {
    const [totalStudents, companies, applicationsGroup, branchGroup] = await Promise.all([
      prisma.student.count(),
      prisma.company.findMany({ select: { id: true, name: true, role: true } }),
      prisma.application.groupBy({
        by: ['companyId'],
        _count: { companyId: true },
      }),
      prisma.companyAllowedBranch.groupBy({
        by: ['branchId'],
        _count: { branchId: true },
      })
    ]);

    const totalCompanies = companies.length;
    const countsMap = Object.fromEntries(
      applicationsGroup.map(g => [g.companyId, g._count.companyId])
    );

    const applicationsByCompany = companies.map(c => ({
      companyId: c.id,
      name: c.name,
      count: countsMap[c.id] || 0,
    }));

    // Role distribution
    const roleCounts = new Map();
    for (const c of companies) {
      const raw = c.role || '';
      raw.split(',').map(r => r.trim()).filter(Boolean).forEach(r => {
        roleCounts.set(r, (roleCounts.get(r) || 0) + 1);
      });
    }
    const roleDistribution = Array.from(roleCounts.entries()).map(([name, count]) => ({ name, count }));

    // Branch distribution (how many companies allow each branch)
    const branchIds = branchGroup.map(b => b.branchId);
    const branches = branchIds.length
      ? await prisma.branch.findMany({ where: { id: { in: branchIds } }, select: { id: true, name: true } })
      : [];
    const branchNameById = Object.fromEntries(branches.map(b => [b.id, b.name]));
    const branchDistribution = branchGroup.map(b => ({
      name: branchNameById[b.branchId] || String(b.branchId),
      count: b._count.branchId,
    }));

    res.json({ totalStudents, totalCompanies, applicationsByCompany, roleDistribution, branchDistribution });
  } catch (err) {
    console.error('Error building admin stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
