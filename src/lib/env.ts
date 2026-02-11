import { z } from 'zod';

const envSchema = z.object({
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is missing'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is missing'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Validates and returns the environment variables.
 * If validation fails, it logs the error but does not crash the process immediately
 * (unless strict mode is enforced elsewhere).
 * 
 * Usage:
 * import { env } from '@/lib/env';
 */
export const env = envSchema.parse(process.env);

export const validateEnv = () => {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
        return { success: false, errors: result.error.flatten().fieldErrors };
    }
    return { success: true, data: result.data };
};
