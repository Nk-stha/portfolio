import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface
export interface IProcessStep extends Document {
    order: number;
    icon: string;
    title: string;
    description: string;
    items: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Schema
const ProcessStepSchema = new Schema<IProcessStep>(
    {
        order: { type: Number, required: true },
        icon: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        items: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// Indexes
ProcessStepSchema.index({ order: 1 });
ProcessStepSchema.index({ isActive: 1, order: 1 });

// Model
export const ProcessStep: Model<IProcessStep> =
    mongoose.models.ProcessStep ||
    mongoose.model<IProcessStep>("ProcessStep", ProcessStepSchema);
