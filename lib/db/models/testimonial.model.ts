import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface
export interface ITestimonial extends Document {
    author: {
        name: string;
        role: string;
        company: string;
        image: string;
    };
    quote: string;
    rating: number;
    isPrimary: boolean;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

// Schema
const TestimonialSchema = new Schema<ITestimonial>(
    {
        author: {
            name: { type: String, required: true },
            role: { type: String, required: true },
            company: { type: String, required: true },
            image: { type: String, required: true },
        },
        quote: { type: String, required: true },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

// Indexes
TestimonialSchema.index({ isActive: 1, order: 1 });
TestimonialSchema.index({ rating: -1 });
TestimonialSchema.index({ deletedAt: 1 });

// Model
export const Testimonial: Model<ITestimonial> =
    mongoose.models.Testimonial ||
    mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
