import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface
export interface ILoginAttempt extends Document {
    identifier: string; // email or IP
    ipAddress: string;
    successful: boolean;
    timestamp: Date;
}

// Schema
const LoginAttemptSchema = new Schema<ILoginAttempt>({
    identifier: {
        type: String,
        required: true,
        index: true,
    },
    ipAddress: {
        type: String,
        required: true,
        index: true,
    },
    successful: {
        type: Boolean,
        required: true,
        default: false,
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
        index: true,
    },
});

// Compound index for efficient queries
LoginAttemptSchema.index({ identifier: 1, timestamp: -1 });
LoginAttemptSchema.index({ ipAddress: 1, timestamp: -1 });

// TTL index to auto-delete old attempts after 24 hours
LoginAttemptSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

// Model
export const LoginAttempt: Model<ILoginAttempt> =
    mongoose.models.LoginAttempt ||
    mongoose.model<ILoginAttempt>("LoginAttempt", LoginAttemptSchema);
