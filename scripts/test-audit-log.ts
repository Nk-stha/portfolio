
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables logic
const envPath = path.join(process.cwd(), ".env");
dotenv.config({ path: envPath });

let mongoUri = process.env.MONGODB_URI;
const username = process.env.MONGO_ROOT_USERNAME;
const password = process.env.MONGO_ROOT_PASSWORD;
const dbName = process.env.MONGO_INITDB_DATABASE || "portfolio";

if (mongoUri && mongoUri.includes("mongodb:27017") && username && password) {
    mongoUri = `mongodb://${username}:${password}@localhost:27017/${dbName}?authSource=admin`;
    process.env.MONGODB_URI = mongoUri;
}

import { connectToDatabase } from "@/lib/db/mongoose";
import { AuditLog } from "@/lib/db/models/auditLog.model";

async function testAuditLog() {
    try {
        console.log("Emptying AuditLog collection...");
        // await connectToDatabase(); // Dynamic import below handles this via mongoose.ts usually, but let's be safe

        // Use dynamic imports to match seed script pattern if needed, but standard import should work if run with tsx and dotenv loaded first
        const { connectToDatabase } = await import("@/lib/db/mongoose");
        await connectToDatabase();

        console.log("Creating failed login log (userId: null)...");
        const log = await AuditLog.create({
            action: "LOGIN",
            targetCollection: "admin_auth",
            userId: null,
            userEmail: "test-fail@example.com",
            changes: { ipAddress: "127.0.0.1", reason: "user_not_found" },
        });

        console.log("✅ Successfully created log:", log);
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to create log:", error);
        process.exit(1);
    }
}

testAuditLog();
