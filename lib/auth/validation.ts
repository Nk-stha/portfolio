/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements:
 * - Minimum 12 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export function validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 12) {
        errors.push("Password must be at least 12 characters long");
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push("Password must contain at least one special character");
    }

    // Check for common weak passwords
    const commonPasswords = ["password123", "admin123456", "qwerty123456"];
    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push("Password is too common, please choose a stronger password");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>\"']/g, "") // Remove potentially dangerous characters
        .substring(0, 1000); // Limit length
}

/**
 * Validate admin input data
 */
export function validateAdminData(data: {
    email?: string;
    password?: string;
    name?: string;
}): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (data.email !== undefined) {
        if (!data.email || !isValidEmail(data.email)) {
            errors.email = "Invalid email address";
        }
    }

    if (data.password !== undefined) {
        const passwordValidation = validatePasswordStrength(data.password);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.errors.join(". ");
        }
    }

    if (data.name !== undefined) {
        if (!data.name || data.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters long";
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}
