import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface
export interface IProfile extends Document {
    name: string;
    title: string;
    email: string;
    phone: string;
    website: string;
    avatarUrl: string;
    hero: {
        greeting: string;
        tagline: string;
        yearsExperience: number;
        projectsShipped: number;
    };
    about: {
        headline: string;
        description: string;
        stats: Array<{ label: string; value: string }>;
    };
    navLinks: Array<{ label: string; href: string }>;
    socialLinks: Array<{ platform: string; icon: string; href: string }>;
    footerNav: Array<{ label: string; href: string }>;
    seo: {
        title: string;
        description: string;
        keywords: string[];
        ogImage: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

// Schema
const ProfileSchema = new Schema<IProfile>(
    {
        name: { type: String, required: true },
        title: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, default: "" },
        website: { type: String, default: "" },
        avatarUrl: { type: String, default: "/animatedprofile.png" },

        hero: {
            greeting: { type: String, default: "Hello!" },
            tagline: { type: String, default: "" },
            yearsExperience: { type: Number, default: 0 },
            projectsShipped: { type: Number, default: 0 },
        },

        about: {
            headline: { type: String, default: "" },
            description: { type: String, default: "" },
            stats: [
                {
                    label: { type: String, required: true },
                    value: { type: String, required: true },
                },
            ],
        },

        navLinks: [
            {
                label: { type: String, required: true },
                href: { type: String, required: true },
            },
        ],

        socialLinks: [
            {
                platform: { type: String, required: true },
                icon: { type: String, required: true },
                href: { type: String, required: true },
            },
        ],

        footerNav: [
            {
                label: { type: String, required: true },
                href: { type: String, required: true },
            },
        ],

        seo: {
            title: { type: String, default: "" },
            description: { type: String, default: "" },
            keywords: [{ type: String }],
            ogImage: { type: String, default: "" },
        },
    },
    {
        timestamps: true,
    }
);

// Note: email index is created automatically via unique: true on field

// Model
export const Profile: Model<IProfile> =
    mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
