import mongoose from "mongoose";

declare global {
    // eslint-disable-next-line no-var
    var mongoose: {
        conn: mongoose.Mongoose | null;
        promise: Promise<mongoose.Mongoose> | null;
    };
}

const getMongoUri = () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error(
            "Please define the MONGODB_URI environment variable inside .env.local"
        );
    }
    return uri;
};

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<mongoose.Mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts: mongoose.ConnectOptions = {
            bufferCommands: false,
        };

        const uri = getMongoUri();
        cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
            console.log("✅ Connected to MongoDB");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default mongoose;
