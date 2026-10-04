import 'dotenv/config';

import { connectDatabase } from '../config/database';
import { hashPassword } from '../utils/auth';

async function createAdmin() {
  const db = await connectDatabase();

  const email =
    process.env.ADMIN_EMAIL ||
    'admin@trchall.local';

  const password =
    process.env.ADMIN_PASSWORD ||
    'ChangeMe123!';

  const existingAdmin =
    await db.collection('admins').findOne({
      email: email.toLowerCase(),
    });

  if (existingAdmin) {
    console.log(
      'Admin account already exists.'
    );

    process.exit(0);
  }

  const hashedPassword =
    await hashPassword(password);

  await db.collection('admins').insertOne({
    name: 'TRC Administrator',
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'ADMIN',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('Admin account created.');
  console.log(`Email: ${email}`);

  process.exit(0);
}

createAdmin().catch((error) => {
  console.error(
    'Failed to create admin:',
    error
  );

  process.exit(1);
});