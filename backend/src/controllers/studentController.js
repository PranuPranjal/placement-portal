const { PrismaClient } = require('@prisma/client');
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
  try {
    const userId = req.user.id;
    const student = await prisma.student.findUnique({ where: { id: userId }, include: { branch: true } });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const companies = await prisma.company.findMany({
      where: {
        cgpaCriteria: { lte: student.cgpa },
        allowedBranches: { some: { branchId: student.branchId } }
      }
    });
    res.json(companies);
  } catch (err) {
    console.error('Error in eligibleCompanies:', err);
    res.status(500).json({ error: 'Failed to fetch eligible companies' });
  }
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
