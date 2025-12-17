import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface
export interface IContactSubmission extends Document {
    email: string;
    name: string | null;
    message: string | null;
    source: "contact_form" | "newsletter" | "hire_button";
    referrer: string | null;
    status: "new" | "read" | "replied" | "archived";
    repliedAt: Date | null;
    ipAddress: string;
    createdAt: Date;
    updatedAt: Date;
}

// Schema
const ContactSubmissionSchema = new Schema<IContactSubmission>(
    {
        email: { type: String, required: true },
        name: { type: String, default: null },
        message: { type: String, default: null },
        source: {
            type: String,
            enum: ["contact_form", "newsletter", "hire_button"],
            required: true,
        },
        referrer: { type: String, default: null },
        status: {
            type: String,
            enum: ["new", "read", "replied", "archived"],
            default: "new",
        },
        repliedAt: { type: Date, default: null },
        ipAddress: { type: String, default: "" },
    },
    {
        timestamps: true,
    }
);

// Indexes
ContactSubmissionSchema.index({ email: 1 });
ContactSubmissionSchema.index({ status: 1, createdAt: -1 });
ContactSubmissionSchema.index({ createdAt: -1 });

// Model
export const ContactSubmission: Model<IContactSubmission> =
    mongoose.models.ContactSubmission ||
    mongoose.model<IContactSubmission>(
        "ContactSubmission",
        ContactSubmissionSchema
    );
