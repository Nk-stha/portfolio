import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface
export interface IProject extends Document {
    title: string;
    description: string;
    image: string;
    images: string[];
    category: "saas" | "ecommerce" | "mobile" | "web";
    tags: string[];
    techStack: string[];
    liveUrl: string | null;
    sourceUrl: string | null;
    caseStudyUrl: string | null;
    isFeatured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

// Schema
const ProjectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        images: [{ type: String }],
        category: {
            type: String,
            enum: ["saas", "ecommerce", "mobile", "web"],
            required: true,
        },
        tags: [{ type: String }],
        techStack: [{ type: String }],
        liveUrl: { type: String, default: null },
        sourceUrl: { type: String, default: null },
        caseStudyUrl: { type: String, default: null },
        isFeatured: { type: Boolean, default: false },
        order: { type: Number, required: true },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

// Indexes
ProjectSchema.index({ category: 1, order: 1 });
ProjectSchema.index({ isFeatured: 1, order: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ deletedAt: 1 });

// Model
export const Project: Model<IProject> =
    mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
