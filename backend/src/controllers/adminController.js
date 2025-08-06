const { PrismaClient } = require('@prisma/client');
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
    console.error('Add company error:', err);
    res.status(400).json({ error: 'Failed to add company' });
  }
};

exports.viewUsers = async (req, res) => {
  const students = await prisma.student.findMany({ include: { branch: true } });
  res.json(students);
};
