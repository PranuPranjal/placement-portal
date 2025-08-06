const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixStudentProfiles() {
  try {
    console.log('Finding users with role "student" who don\'t have Student profiles...');
    
    // Find all users with role 'student'
    const studentUsers = await prisma.user.findMany({
      where: { role: 'student' }
    });
    
    console.log(`Found ${studentUsers.length} student users`);
    
    for (const user of studentUsers) {
      // Check if Student record already exists
      const existingStudent = await prisma.student.findUnique({
        where: { id: user.id }
      });
      
      if (!existingStudent) {
        console.log(`Creating Student profile for user: ${user.name} (ID: ${user.id})`);
        
        // Create Student record with same ID as User
        await prisma.student.create({
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            branchId: 1, // Default to first branch (you can change this)
            cgpa: 0.0    // Default CGPA (student can update later)
          }
        });
        
        console.log(`✅ Created Student profile for ${user.name}`);
      } else {
        console.log(`✅ Student profile already exists for ${user.name}`);
      }
    }
    
    console.log('✅ All student profiles are now fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing student profiles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixStudentProfiles();
