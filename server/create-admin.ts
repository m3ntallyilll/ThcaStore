
import { storage } from "./database-storage";
import bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    const adminData = {
      username: "admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      firstName: "Admin",
      lastName: "User",
      isAdmin: true
    };

    const existingUser = await storage.getUserByEmail(adminData.email);
    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    const admin = await storage.createUser(adminData);
    console.log("Admin user created successfully:");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
    console.log("User ID:", admin.id);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

createAdmin();
