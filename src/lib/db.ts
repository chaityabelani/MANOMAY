import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global caching interface to prevent multiple connections
 * during hot-reload in development and serverless invocations.
 */
interface MongooseCache {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
}

// Augment the NodeJS global type
declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<mongoose.Connection> {
    // 1. Check for Env Var inside the function (Runtime safe)
    if (!MONGODB_URI) {
        // Instead of crashing, we log a critical error and throw a descriptive one
        // that can be caught by the API route/Action.
        console.error("❌ CRITICAL: MONGODB_URI is not defined.");
        throw new Error(
            'Database configuration error: MONGODB_URI is missing. Please check your .env.local or Vercel Environment Variables.'
        );
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('✅ New MongoDB Connection Established');
            return mongoose.connection;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error("❌ MongoDB Connection Error:", e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
