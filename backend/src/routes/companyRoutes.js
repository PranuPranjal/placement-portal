const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Middleware to authenticate company users
const authenticateCompany = (req, res, next) => {
  authenticate(req, res, () => {
    if (req.user.role !== 'company') {
      return res.status(403).json({ error: 'Access denied. Company role required.' });
    }
    next();
  });
};

router.use(authenticateCompany);

// Get company profile and associated company details
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: {
          include: {
            allowedBranches: {
              include: { branch: true }
            }
          }
        }
      }
    });

    if (!user || !user.company) {
      return res.status(404).json({ error: 'Company profile not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      company: user.company
    });
  } catch (err) {
    console.error('Get company profile error:', err);
    res.status(500).json({ error: 'Failed to get company profile' });
  }
});

// Get all applicants for this company
router.get('/applicants', async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching applicants for user ID:', userId);
    
    // Get the company associated with this user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true }
    });
    console.log('User found:', user);

    if (!user || !user.companyId) {
      console.log('No company found for user');
      return res.status(404).json({ error: 'Company not found for this user' });
    }

    console.log('Fetching applications for company ID:', user.companyId);
    // Get all applications for this company
    const applications = await prisma.application.findMany({
      where: { companyId: user.companyId },
      include: {
        student: {
          include: { 
            branch: true 
          }
        },
        company: true
      },
      orderBy: { id: 'desc' }
    });
    console.log('Applications found:', applications.length);

    const applicants = applications.map(app => ({
      applicationId: app.id,
      student: {
        id: app.student.id,
        name: app.student.name,
        email: app.student.email,
        branch: app.student.branch.name,
        role: app.role, 
        cgpa: app.student.cgpa,
        cvPath: app.student.cvPath,
        photoPath: app.student.photoPath,
        aadharPath: app.student.aadharPath,
        ugMarksheetPath: app.student.ugMarksheetPath,
        xMarksheetPath: app.student.xMarksheetPath,
        xiiMarksheetPath: app.student.xiiMarksheetPath,
        rollNumber: app.student.rollNumber,
        registrationNumber: app.student.registrationNumber,
        XPercentage: app.student.XPercentage,
        XIIPercentage: app.student.XIIPercentage
      },
      status: app.status,
      appliedAt: new Date() // Using current date since createdAt field doesn't exist
    }));

    console.log('Returning applicants:', applicants.length);
    res.json(applicants);
  } catch (err) {
    console.error('Get applicants error:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: 'Failed to get applicants: ' + err.message });
  }
});

// Update application status (accept/reject)
router.put('/applicants/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Verify this application belongs to the company
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true }
    });

    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
      select: { companyId: true }
    });

    if (!application || application.companyId !== user.companyId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: { status },
      include: {
        student: {
          include: { branch: true }
        }
      }
    });

    res.json({
      message: 'Application status updated successfully',
      application: updatedApplication
    });
  } catch (err) {
    console.error('Update application status error:', err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

module.exports = router;
