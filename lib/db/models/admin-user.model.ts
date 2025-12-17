import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface
export interface IAdminUser extends Document {
    email: string;
    passwordHash: string;
    name: string;
    role: "super_admin" | "admin";
    isActive: boolean;
    loginAttempts: number;
    lockoutUntil: Date | null;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    isLocked(): boolean;
    incLoginAttempts(): Promise<any>;
    resetLoginAttempts(): Promise<any>;
}

// Schema
const AdminUserSchema = new Schema<IAdminUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["super_admin", "admin"],
            default: "admin",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockoutUntil: {
            type: Date,
            default: null,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for performance
AdminUserSchema.index({ email: 1 });
AdminUserSchema.index({ isActive: 1 });
AdminUserSchema.index({ lockoutUntil: 1 });

// Method to check if account is locked
AdminUserSchema.methods.isLocked = function (): boolean {
    return !!(this.lockoutUntil && this.lockoutUntil > new Date());
};

// Method to increment login attempts
AdminUserSchema.methods.incLoginAttempts = async function () {
    // If we have a previous lock that has expired, reset attempts
    if (this.lockoutUntil && this.lockoutUntil < new Date()) {
        return await this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockoutUntil: 1 },
        });
    }

    // Otherwise, increment login attempts
    const updates: any = { $inc: { loginAttempts: 1 } };

    // Lock the account if max attempts reached
    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5");
    const lockoutMinutes = parseInt(process.env.LOCKOUT_DURATION_MINUTES || "30");

    if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
        updates.$set = { lockoutUntil: new Date(Date.now() + lockoutMinutes * 60 * 1000) };
    }

    return await this.updateOne(updates);
};

// Method to reset login attempts on successful login
AdminUserSchema.methods.resetLoginAttempts = async function () {
    return await this.updateOne({
        $set: { loginAttempts: 0, lastLogin: new Date() },
        $unset: { lockoutUntil: 1 },
    });
};

// Model
export const AdminUser: Model<IAdminUser> =
    mongoose.models.AdminUser ||
    mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);
