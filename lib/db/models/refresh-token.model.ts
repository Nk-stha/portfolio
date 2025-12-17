import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface
export interface IRefreshToken extends Document {
    token: string;
    adminId: mongoose.Types.ObjectId;
    expiresAt: Date;
    isRevoked: boolean;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
    isValid(): boolean;
}

// Schema
const RefreshTokenSchema = new Schema<IRefreshToken>(
    {
        token: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        adminId: {
            type: Schema.Types.ObjectId,
            ref: "AdminUser",
            required: true,
            index: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
        isRevoked: {
            type: Boolean,
            default: false,
            index: true,
        },
        ipAddress: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for performance and automatic cleanup
RefreshTokenSchema.index({ token: 1 });
RefreshTokenSchema.index({ adminId: 1, isRevoked: 1 });
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion

// Method to check if token is valid
RefreshTokenSchema.methods.isValid = function (): boolean {
    return !this.isRevoked && this.expiresAt > new Date();
};

// Model
export const RefreshToken: Model<IRefreshToken> =
    mongoose.models.RefreshToken ||
    mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);
