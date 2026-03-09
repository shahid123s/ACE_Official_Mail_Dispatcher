import { useState, useEffect } from "react";
import { Users, Shield, ShieldOff, UserCheck, UserX, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
    getUsersRequest,
    updateUserRoleRequest,
    toggleUserActiveRequest,
} from "../lib/api";

interface UserRecord {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    active: boolean;
    createdAt?: string;
}

const UsersPage = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState<string | null>(null);
    const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showMsg = (type: "success" | "error", msg: string) => {
        setActionMsg({ type, msg });
        setTimeout(() => setActionMsg(null), 3000);
    };

    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getUsersRequest(token!);
            setUsers(data.users || data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleToggle = async (user: UserRecord) => {
        const newRole = user.role === "admin" ? "user" : "admin";
        setBusy(user.id + "_role");
        try {
            await updateUserRoleRequest(token!, user.id, newRole);
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
            );
            showMsg("success", `${user.name} is now ${newRole}`);
        } catch (err) {
            showMsg("error", err instanceof Error ? err.message : "Failed to update role");
        } finally {
            setBusy(null);
        }
    };

    const handleActiveToggle = async (user: UserRecord) => {
        const newActive = !user.active;
        setBusy(user.id + "_active");
        try {
            await toggleUserActiveRequest(token!, user.id, newActive);
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, active: newActive } : u))
            );
            showMsg("success", `${user.name} has been ${newActive ? "activated" : "deactivated"}`);
        } catch (err) {
            showMsg("error", err instanceof Error ? err.message : "Failed to update status");
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Control who can dispatch emails and their roles
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Action feedback */}
            {actionMsg && (
                <div
                    className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium border ${actionMsg.type === "success"
                            ? "bg-accent/20 border-accent text-accent-foreground"
                            : "bg-destructive/10 border-destructive/20 text-destructive"
                        }`}
                >
                    {actionMsg.msg}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading users...
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            {/* Empty */}
            {!loading && !error && users.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Users className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm font-medium">No users found</p>
                </div>
            )}

            {/* Table */}
            {!loading && !error && users.length > 0 && (
                <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50 text-left">
                                <th className="px-5 py-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                                    User
                                </th>
                                <th className="px-5 py-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                                    Role
                                </th>
                                <th className="px-5 py-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                    {/* User info */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                                                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Role badge */}
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${user.role === "admin"
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            <Shield className="w-3 h-3" />
                                            {user.role}
                                        </span>
                                    </td>

                                    {/* Active badge */}
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${user.active
                                                    ? "bg-accent/20 text-accent-foreground"
                                                    : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {user.active ? (
                                                <UserCheck className="w-3 h-3" />
                                            ) : (
                                                <UserX className="w-3 h-3" />
                                            )}
                                            {user.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 justify-end">
                                            <button
                                                id={`toggle-role-${user.id}`}
                                                onClick={() => handleRoleToggle(user)}
                                                disabled={busy === user.id + "_role"}
                                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
                                                title={user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                                            >
                                                {user.role === "admin" ? (
                                                    <ShieldOff className="w-3.5 h-3.5" />
                                                ) : (
                                                    <Shield className="w-3.5 h-3.5" />
                                                )}
                                                {user.role === "admin" ? "Demote" : "Make Admin"}
                                            </button>
                                            <button
                                                id={`toggle-active-${user.id}`}
                                                onClick={() => handleActiveToggle(user)}
                                                disabled={busy === user.id + "_active"}
                                                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${user.active
                                                        ? "border border-destructive/30 text-destructive hover:bg-destructive/10"
                                                        : "border border-accent text-accent-foreground hover:bg-accent/20"
                                                    }`}
                                                title={user.active ? "Deactivate user" : "Activate user"}
                                            >
                                                {user.active ? (
                                                    <UserX className="w-3.5 h-3.5" />
                                                ) : (
                                                    <UserCheck className="w-3.5 h-3.5" />
                                                )}
                                                {user.active ? "Deactivate" : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
