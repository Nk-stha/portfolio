import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface
export interface IExperience extends Document {
    company: string;
    role: string;
    description: string;
    startDate: Date;
    endDate: Date | null;
    isPrimary: boolean;
    order: number;
    companyLogo: string | null;
    companyUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

// Schema
const ExperienceSchema = new Schema<IExperience>(
    {
        company: { type: String, required: true },
        role: { type: String, required: true },
        description: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, default: null },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, required: true },
        companyLogo: { type: String, default: null },
        companyUrl: { type: String, default: null },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

// Indexes
ExperienceSchema.index({ order: 1 });
ExperienceSchema.index({ deletedAt: 1 });
ExperienceSchema.index({ startDate: -1 });

// Virtual for period display
ExperienceSchema.virtual("period").get(function () {
    const start = this.startDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
    const end = this.endDate
        ? this.endDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        })
        : "Present";
    return `${start} - ${end}`;
});

// Ensure virtuals are included in JSON
ExperienceSchema.set("toJSON", { virtuals: true });
ExperienceSchema.set("toObject", { virtuals: true });

// Model
export const Experience: Model<IExperience> =
    mongoose.models.Experience ||
    mongoose.model<IExperience>("Experience", ExperienceSchema);
