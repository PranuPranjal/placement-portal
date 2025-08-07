const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

function parseLocalDateTime(input) {
  const [datePart, timePart] = input.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute); // local date
}


exports.addCompany = async (req, res) => {
  const { name, role, salary, cgpaCriteria, deadline, description, allowedBranchIds, password } = req.body;
  
  console.log('AddCompany request received:', { name, role, salary, cgpaCriteria, deadline, description, allowedBranchIds, password: password ? '***' : 'undefined' });
  
  try {
    console.log('Creating company...');
    const company = await prisma.company.create({
      data: {
        name, role, salary: parseFloat(salary), cgpaCriteria: parseFloat(cgpaCriteria), 
        deadline: parseLocalDateTime(deadline), description, password,
        filePath: req.file ? req.file.filename : null,
        allowedBranches: {
          create: JSON.parse(allowedBranchIds).map(branchId => ({ branchId: parseInt(branchId) }))
        }
      }
    });
    console.log('Company created successfully:', company.id);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const companyEmail = name.toLowerCase().replace(/\s+/g, '') + '@company.nitap';
    console.log('Creating user with email:', companyEmail);
    
    const user = await prisma.user.create({
      data: {
        name,
        email: companyEmail,
        password: hashedPassword,
        role: 'company',
        companyId: company.id
      }
    });
    console.log('User created successfully:', user.id);
    
    res.json({ company, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Add company error:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    res.status(400).json({ error: 'Failed to add company: ' + err.message });
  }
};

exports.viewUsers = async (req, res) => {
  const students = await prisma.student.findMany({ include: { branch: true } });
  res.json(students);
};
