import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables immediately
const envPath = path.join(process.cwd(), ".env");
dotenv.config({ path: envPath });

let mongoUri = process.env.MONGODB_URI;
const username = process.env.MONGO_ROOT_USERNAME;
const password = process.env.MONGO_ROOT_PASSWORD;
const dbName = process.env.MONGO_INITDB_DATABASE || "portfolio";

// If using Docker hostname but running locally (heuristic), try to use localhost with credentials
if (mongoUri && mongoUri.includes("mongodb:27017") && username && password) {
    console.log("⚠️  Detected Docker hostname in URI. Switching to localhost for script execution...");
    mongoUri = `mongodb://${username}:${password}@localhost:27017/${dbName}?authSource=admin`;
}

// Verify env var is loaded
if (!mongoUri) {
    console.error("❌ MONGODB_URI not found in environment variables");
    console.error(`Attempted to load from: ${envPath}`);
    process.exit(1);
}

// Override process.env.MONGODB_URI strictly for this script's process
process.env.MONGODB_URI = mongoUri;

const INITIAL_EMAIL = process.env.INITIAL_ADMIN_EMAIL || "admin@rohanportfolio.com";
const INITIAL_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD || "Nikeshshrestha@015544";

async function seedInitialAdmin() {
    try {
        console.log("🔐 Seeding initial admin user...\\n");

        // Dynamic imports to ensure env vars are loaded first
        const { connectToDatabase } = await import("@/lib/db/mongoose");
        const { AdminUser } = await import("@/lib/db/models");
        const { hashPassword } = await import("@/lib/auth/password");

        await connectToDatabase();

        // Check if admin already exists
        const existingAdmin = await AdminUser.findOne({ email: INITIAL_EMAIL.toLowerCase() });

        if (existingAdmin) {
            console.log(`✅ Admin user already exists: ${INITIAL_EMAIL}`);
            console.log(`   Role: ${existingAdmin.role}`);
            console.log(`   Status: ${existingAdmin.isActive ? "Active" : "Inactive"}\\n`);
            return;
        }

        // Hash password
        const passwordHash = await hashPassword(INITIAL_PASSWORD);

        // Create admin user
        const admin = await AdminUser.create({
            email: INITIAL_EMAIL.toLowerCase(),
            passwordHash,
            name: "Super Admin",
            role: "super_admin",
            isActive: true,
            loginAttempts: 0,
        });

        console.log("✅ Initial admin user created successfully!\\n");
        console.log("═══════════════════════════════════════");
        console.log("📧 Email:", admin.email);
        console.log("👤 Name:", admin.name);
        console.log("🔑 Role:", admin.role);
        console.log("✨ Status:", admin.isActive ? "Active" : "Inactive");
        console.log("═══════════════════════════════════════\\n");
        console.log("⚠️  IMPORTANT SECURITY NOTICE:");
        console.log("   Please change the default password after first login!");
        console.log("   Login at: http://localhost:3001/admin/login\\n");

    } catch (error) {
        console.error("❌ Error seeding admin user:", error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

seedInitialAdmin();
