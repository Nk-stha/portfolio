import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface
export interface IBlogPost extends Document {
    slug: string;
    title: string;
    category: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    author: {
        name: string;
        avatar: string;
    };
    publishedAt: Date | null;
    metaTitle: string;
    metaDescription: string;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

// Schema
const BlogPostSchema = new Schema<IBlogPost>(
    {
        slug: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        category: { type: String, required: true },
        content: { type: String, default: "" },
        excerpt: { type: String, default: "" },
        featuredImage: { type: String, required: true },
        author: {
            name: { type: String, required: true },
            avatar: { type: String, default: "/animatedprofile.png" },
        },
        publishedAt: { type: Date, default: null },
        metaTitle: { type: String, default: "" },
        metaDescription: { type: String, default: "" },
        isFeatured: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

// Indexes (slug index created automatically via unique: true on field)
BlogPostSchema.index({ category: 1, publishedAt: -1 });
BlogPostSchema.index({ publishedAt: -1 });
BlogPostSchema.index({ isFeatured: 1 });
BlogPostSchema.index({ deletedAt: 1 });

// Virtual for checking if published
BlogPostSchema.virtual("isPublished").get(function () {
    return this.publishedAt !== null && this.publishedAt <= new Date();
});

// Ensure virtuals are included
BlogPostSchema.set("toJSON", { virtuals: true });
BlogPostSchema.set("toObject", { virtuals: true });

// Model
export const BlogPost: Model<IBlogPost> =
    mongoose.models.BlogPost ||
    mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
