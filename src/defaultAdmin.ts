import prisma from './database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const createDefaultAdmin = async () => {
  // Use environment variables for the default admin email and password
  const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
  const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!defaultEmail || !defaultPassword) {
    console.error('Default admin email or password is not set in .env file.');
    return;
  }

  try {
    // Check if the default admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: defaultEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 12);

      const admin = await prisma.user.create({
        data: {
          name: 'Default Admin',
          email: defaultEmail,
          password: hashedPassword,
          registeredDate: new Date(),
          role: 'ADMIN',
        },
      });

      console.log('Default admin account created');
    } else {
      console.log('Default admin account already exists');
    }
  } catch (error) {
    console.error('Error creating default admin account:', error);
  }
};
