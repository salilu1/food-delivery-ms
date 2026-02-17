import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const main = async () => {
  const email = "admin@gmail.com";
  const name = "admin";
  const password = "admin123"; // change this to whatever you want

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  if (existingAdmin) {
    console.log("Admin already exists!");
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin
  const admin = await prisma.user.create({
    data: {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("Admin created successfully!");
  console.log(admin);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
