const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.updateProfile = async (req, res) => {
  const { name, cgpa, XPercentage, XIIPercentage, branchId } = req.body;
  const userId = req.user.id;
  
  const cvFile = req.files && req.files.cv ? req.files.cv[0] : null;
  const photoFile = req.files && req.files.photo ? req.files.photo[0] : null;
  const aadharFile = req.files && req.files.aadhar ? req.files.aadhar[0] : null;
  const ugMarksheetFile = req.files && req.files.ugMarksheet ? req.files.ugMarksheet[0] : null;
  const xMarksheetFile = req.files && req.files.xMarksheet ? req.files.xMarksheet[0] : null;
  const xiiMarksheetFile = req.files && req.files.xiiMarksheet ? req.files.xiiMarksheet[0] : null;
  
  console.log('UpdateProfile request:', { 
    name, cgpa, XPercentage, XIIPercentage, branchId, userId, 
    cvFile: cvFile ? cvFile.filename : 'none', 
    photoFile: photoFile ? photoFile.filename : 'none', 
    aadharFile: aadharFile ? aadharFile.filename : 'none', 
    ugMarksheetFile: ugMarksheetFile ? ugMarksheetFile.filename : 'none', 
    xMarksheetFile: xMarksheetFile ? xMarksheetFile.filename : 'none', 
    xiiMarksheetFile: xiiMarksheetFile ? xiiMarksheetFile.filename : 'none' 
  });
  
  if (!name || cgpa === undefined || !branchId || XPercentage === undefined || XIIPercentage === undefined) {
    console.log('Validation failed: missing required fields');
    return res.status(400).json({ error: 'Name, CGPA, XPercentage, XIIPercentage, and Branch are required' });
  }
  
  if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
    console.log('Validation failed: invalid CGPA');
    return res.status(400).json({ error: 'CGPA must be a number between 0 and 10' });
  }
  
  if (isNaN(branchId)) {
    console.log('Validation failed: invalid branchId');
    return res.status(400).json({ error: 'Invalid branch ID' });
  }
  
  try {
    // Get user email from User table since it's not in JWT token
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prepare update data
    const updateData = {
      name,
      cgpa: parseFloat(cgpa),
      XPercentage: parseFloat(XPercentage),
      XIIPercentage: parseFloat(XIIPercentage),
      branchId: parseInt(branchId)
    };
    
    const createData = {
      id: userId,
      name,
      email: user.email,
      cgpa: parseFloat(cgpa),
      XPercentage: parseFloat(XPercentage),
      XIIPercentage: parseFloat(XIIPercentage),
      branchId: parseInt(branchId)
    };
    
    // Add CV path if file was uploaded
    if (cvFile) {
      updateData.cvPath = cvFile.filename;
      createData.cvPath = cvFile.filename;
    }
    // Add photo path if file was uploaded
    if (photoFile) {
      updateData.photoPath = photoFile.filename;
      createData.photoPath = photoFile.filename;
    }
    // Add aadhar path if file was uploaded
    if (aadharFile) {
      updateData.aadharPath = aadharFile.filename;
      createData.aadharPath = aadharFile.filename;
    }
    // Add UG marks path if file was uploaded
    if (ugMarksheetFile) {
      updateData.ugMarksheetPath = ugMarksheetFile.filename;
      createData.ugMarksheetPath = ugMarksheetFile.filename;
    }
    // Add X marks path if file was uploaded
    if (xMarksheetFile) {
      updateData.xMarksheetPath = xMarksheetFile.filename;
      createData.xMarksheetPath = xMarksheetFile.filename;
    }
    // Add XII marks path if file was uploaded
    if (xiiMarksheetFile) {
      updateData.xiiMarksheetPath = xiiMarksheetFile.filename;
      createData.xiiMarksheetPath = xiiMarksheetFile.filename;
    }
    
    const student = await prisma.student.upsert({
      where: { id: userId },
      update: updateData,
      create: createData
    });
    console.log('Profile updated successfully:', student);
    res.json(student);
  } catch (err) {
    console.error('Database error in updateProfile:', err);
    res.status(400).json({ error: 'Could not update profile: ' + err.message });
  }
};

exports.eligibleCompanies = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await prisma.student.findUnique({ where: { id: userId }, include: { branch: true } });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    // Get companies the student has already applied to
    const appliedCompanies = await prisma.application.findMany({
      where: { studentId: userId },
      select: { companyId: true }
    });
    const appliedCompanyIds = appliedCompanies.map(app => app.companyId);
    
    // Get eligible companies excluding those already applied to
    const companies = await prisma.company.findMany({
      where: {
        cgpaCriteria: { lte: student.cgpa },
        allowedBranches: { some: { branchId: student.branchId } },
        id: { notIn: appliedCompanyIds } // Exclude applied companies
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
  const { selectedRole, xpercentage, xiipercentage, rollNumber, registrationNumber } = req.body;
  const studentId = req.user.id;
  const cvFile = req.file;

  try {
    const updateData = {};
    if (cvFile) {
      updateData.cvPath = cvFile.filename;
    }
    if (xpercentage) {
      updateData.XPercentage = parseFloat(xpercentage);
    }
    if (xiipercentage) {
      updateData.XIIPercentage = parseFloat(xiipercentage);
    }
    if (rollNumber) {
      updateData.rollNumber = parseInt(rollNumber);
    }
    if (registrationNumber) {
      updateData.registrationNumber = parseInt(registrationNumber);
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.student.update({
        where: { id: studentId },
        data: updateData
      });
      console.log('Updated student profile fields:', updateData);
    }

    const application = await prisma.application.create({
      data: {
        studentId: parseInt(studentId),
        companyId: parseInt(companyId),
        role: selectedRole
      }
    });

    console.log('Application created successfully:', application);
    res.json(application);
  } catch (err) {
    console.error('Apply company error:', err);
    res.status(400).json({ error: 'Could not apply to company: ' + err.message });
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
