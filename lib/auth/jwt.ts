import jwt from "jsonwebtoken";

const getAccessSecret = () => {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined");
    return secret;
};

const getRefreshSecret = () => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined");
    return secret;
};

const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

export interface TokenPayload {
    adminId: string;
    email: string;
    role: string;
}

/**
 * Generate an access token (short-lived)
 */
export function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, getAccessSecret(), {
        expiresIn: ACCESS_EXPIRY as any,
        issuer: "portfolio-admin",
        audience: "portfolio-admin",
    });
}

/**
 * Generate a refresh token (long-lived)
 */
export function generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, getRefreshSecret(), {
        expiresIn: REFRESH_EXPIRY as any,
        issuer: "portfolio-admin",
        audience: "portfolio-admin",
    });
}

/**
 * Verify and decode an access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, getAccessSecret(), {
            issuer: "portfolio-admin",
            audience: "portfolio-admin",
        }) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Verify and decode a refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, getRefreshSecret(), {
            issuer: "portfolio-admin",
            audience: "portfolio-admin",
        }) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Decode token without verification (for expired token inspection)
 */
export function decodeToken(token: string): TokenPayload | null {
    try {
        return jwt.decode(token) as TokenPayload;
    } catch (error) {
        return null;
    }
}
