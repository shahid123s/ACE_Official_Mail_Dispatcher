const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const getHeaders = (token?: string | null) => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const loginRequest = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Login failed");
    }
    return res.json() as Promise<{ token: string; user: { id: string; name: string; email: string; role: "admin" | "user" } }>;
};

// ─── Mail ──────────────────────────────────────────────────────────────────────

export interface SendMailPayload {
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    html: string;
}

export const sendMailRequest = async (token: string, payload: SendMailPayload) => {
    const res = await fetch(`${BASE_URL}/mail/send`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to send email");
    }
    return res.json();
};

export const getSentMailsRequest = async (token: string) => {
    const res = await fetch(`${BASE_URL}/mail/sent`, {
        headers: getHeaders(token),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch sent mails");
    }
    return res.json();
};

// ─── Users ─────────────────────────────────────────────────────────────────────

export const getUsersRequest = async (token: string) => {
    const res = await fetch(`${BASE_URL}/users`, {
        headers: getHeaders(token),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch users");
    }
    return res.json();
};

export const updateUserRoleRequest = async (
    token: string,
    userId: string,
    role: "admin" | "user"
) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/role`, {
        method: "PATCH",
        headers: getHeaders(token),
        body: JSON.stringify({ role }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update role");
    }
    return res.json();
};

export const toggleUserActiveRequest = async (
    token: string,
    userId: string,
    active: boolean
) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/active`, {
        method: "PATCH",
        headers: getHeaders(token),
        body: JSON.stringify({ active }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update user status");
    }
    return res.json();
};
