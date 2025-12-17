import { connectToDatabase } from "../db/mongoose";
import { LoginAttempt } from "../db/models";

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"); // 15 min
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "5");

/**
 * Check if an identifier (email or IP) is rate limited
 */
export async function checkRateLimit(
    identifier: string,
    ipAddress: string
): Promise<{ isAllowed: boolean; remainingAttempts: number; resetTime?: Date }> {
    await connectToDatabase();

    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

    // Count recent attempts for this identifier
    const recentAttempts = await LoginAttempt.countDocuments({
        $or: [{ identifier }, { ipAddress }],
        timestamp: { $gte: windowStart },
    });

    const isAllowed = recentAttempts < RATE_LIMIT_MAX_REQUESTS;
    const remainingAttempts = Math.max(0, RATE_LIMIT_MAX_REQUESTS - recentAttempts);

    // Calculate when the rate limit will reset
    let resetTime: Date | undefined;
    if (!isAllowed) {
        const oldestAttempt = await LoginAttempt.findOne({
            $or: [{ identifier }, { ipAddress }],
            timestamp: { $gte: windowStart },
        }).sort({ timestamp: 1 });

        if (oldestAttempt) {
            resetTime = new Date(oldestAttempt.timestamp.getTime() + RATE_LIMIT_WINDOW_MS);
        }
    }

    return {
        isAllowed,
        remainingAttempts,
        resetTime,
    };
}

/**
 * Record a login attempt
 */
export async function recordLoginAttempt(
    identifier: string,
    ipAddress: string,
    successful: boolean
): Promise<void> {
    await connectToDatabase();

    await LoginAttempt.create({
        identifier,
        ipAddress,
        successful,
        timestamp: new Date(),
    });
}

/**
 * Clean up old login attempts (called periodically)
 */
export async function cleanupOldAttempts(): Promise<number> {
    await connectToDatabase();

    const cutoffDate = new Date(Date.now() - RATE_LIMIT_WINDOW_MS * 2); // Keep 2x window for safety

    const result = await LoginAttempt.deleteMany({
        timestamp: { $lt: cutoffDate },
    });

    return result.deletedCount || 0;
}
