import { z } from 'zod';

const envSchema = z.object({
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is missing'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is missing'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Validates and returns the environment variables.
 * Uses safeParse to prevent build crashes when env vars are missing.
 */
const parseEnv = () => {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
        // Return safe defaults for development
        return {
            MONGODB_URI: process.env.MONGODB_URI || '',
            JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
            NODE_ENV: 'development' as const
        };
    }
    return result.data;
};

export const env = parseEnv();

export const validateEnv = () => {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
        return { success: false, errors: result.error.flatten().fieldErrors };
    }
    return { success: true, data: result.data };
};
