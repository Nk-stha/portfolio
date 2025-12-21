import mongoose, { Schema, Document, Model, Types } from "mongoose";

// TypeScript interface
export interface IAuditLog extends Document {
    action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
    targetCollection: string;
    documentId?: Types.ObjectId; // Made optional
    userId: Types.ObjectId | null;
    userEmail: string;
    changes: Record<string, unknown>; // Made flexible
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
}

// Schema
const AuditLogSchema = new Schema<IAuditLog>(
    {
        action: {
            type: String,
            enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"],
            required: true,
        },
        targetCollection: { type: String, required: true },
        documentId: { type: Schema.Types.ObjectId, required: false },
        userId: { type: Schema.Types.ObjectId, default: null },
        userEmail: { type: String, required: true },
        changes: { type: Schema.Types.Mixed, default: {} }, // Made flexible
        ipAddress: { type: String, default: "" },
        userAgent: { type: String, default: "" },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Indexes
AuditLogSchema.index({ targetCollection: 1, documentId: 1 });
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });

// Optional: TTL index to auto-delete logs after 90 days
// AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Model
export const AuditLog: Model<IAuditLog> =
    mongoose.models.AuditLog ||
    mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
