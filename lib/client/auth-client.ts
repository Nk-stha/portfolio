/**
 * Client-side auth utilities for managing tokens and authentication state
 */

/**
 * Get access token from session storage
 */
export function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("accessToken");
}

/**
 * Set access token in session storage
 */
export function setAccessToken(token: string): void {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("accessToken", token);
}

/**
 * Remove access token from session storage
 */
export function removeAccessToken(): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("adminUser");
}

/**
 * Get current admin user from session storage
 */
export function getAdminUser(): {
    id: string;
    email: string;
    name: string;
    role: string;
} | null {
    if (typeof window === "undefined") return null;
    const userStr = sessionStorage.getItem("adminUser");
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!getAccessToken();
}

/**
 * Logout user (clear tokens and redirect)
 */
export async function logout(): Promise<void> {
    try {
        // Call logout endpoint to revoke refresh token
        await fetch("/api/admin/auth/logout", {
            method: "POST",
            credentials: "include",
        });
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        // Clear client-side tokens
        removeAccessToken();

        // Redirect to login
        if (typeof window !== "undefined") {
            window.location.href = "/admin/login";
        }
    }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<boolean> {
    try {
        const response = await fetch("/api/admin/auth/refresh", {
            method: "POST",
            credentials: "include", // Important for httpOnly cookie
        });

        if (response.ok) {
            const data = await response.json();
            setAccessToken(data.accessToken);
            return true;
        } else {
            // Refresh token is invalid or expired
            removeAccessToken();
            return false;
        }
    } catch (error) {
        console.error("Token refresh error:", error);
        removeAccessToken();
        return false;
    }
}

/**
 * Make authenticated API request
 * Automatically adds Bearer token and handles 401 responses
 */
export async function authenticatedFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = getAccessToken();

    if (!token) {
        throw new Error("No access token available");
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    // If unauthorized, try to refresh token
    if (response.status === 401) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
            // Retry request with new token
            const newToken = getAccessToken();
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${newToken}`,
                },
            });
        } else {
            // Refresh failed, redirect to login
            await logout();
            throw new Error("Session expired");
        }
    }

    return response;
}
