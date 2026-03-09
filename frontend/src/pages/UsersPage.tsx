import { useState, useEffect } from "react";
import {
    Users,
    Shield,
    ShieldOff,
    UserCheck,
    UserX,
    RefreshCw,
    UserPlus,
    X,
    Copy,
    CheckCheck,
    AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
    getUsersRequest,
    updateUserRoleRequest,
    toggleUserActiveRequest,
    createUserRequest,
} from "../lib/api";

interface UserRecord {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    active: boolean;
    mustChangePassword?: boolean;
}

interface TempPasswordModal {
    name: string;
    email: string;
    tempPassword: string;
}

const UsersPage = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState<string | null>(null);
    const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    // Create user form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newRole, setNewRole] = useState<"admin" | "user">("user");
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState("");

    // Temp password modal
    const [tempModal, setTempModal] = useState<TempPasswordModal | null>(null);
    const [copied, setCopied] = useState(false);

    const showMsg = (type: "success" | "error", msg: string) => {
        setActionMsg({ type, msg });
        setTimeout(() => setActionMsg(null), 4000);
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

    useEffect(() => { fetchUsers(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError("");
        setCreateLoading(true);
        try {
            const result = await createUserRequest(token!, newName, newEmail, newRole);
            setUsers((prev) => [result.user as UserRecord, ...prev]);
            setShowCreateForm(false);
            setNewName(""); setNewEmail(""); setNewRole("user");
            setTempModal({ name: result.user.name, email: result.user.email, tempPassword: result.tempPassword });
        } catch (err) {
            setCreateError(err instanceof Error ? err.message : "Failed to create user");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCopy = () => {
        if (tempModal) {
            navigator.clipboard.writeText(tempModal.tempPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRoleToggle = async (user: UserRecord) => {
        const newRole = user.role === "admin" ? "user" : "admin";
        setBusy(user.id + "_role");
        try {
            await updateUserRoleRequest(token!, user.id, newRole);
            setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
            showMsg("success", `${user.name} is now ${newRole}`);
        } catch (err) {
            showMsg("error", err instanceof Error ? err.message : "Failed to update role");
        } finally { setBusy(null); }
    };

    const handleActiveToggle = async (user: UserRecord) => {
        const newActive = !user.active;
        setBusy(user.id + "_active");
        try {
            await toggleUserActiveRequest(token!, user.id, newActive);
            setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, active: newActive } : u));
            showMsg("success", `${user.name} has been ${newActive ? "activated" : "deactivated"}`);
        } catch (err) {
            showMsg("error", err instanceof Error ? err.message : "Failed to update status");
        } finally { setBusy(null); }
    };

    return (
        <div className="max-w-5xl mx-auto p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
                    <p className="text-sm text-muted-foreground mt-1">Control who can dispatch emails and their roles</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                    <button
                        id="create-user-btn"
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        <UserPlus className="w-4 h-4" /> Add User
                    </button>
                </div>
            </div>

            {/* Action feedback */}
            {actionMsg && (
                <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium border ${actionMsg.type === "success" ? "bg-accent/20 border-accent text-accent-foreground" : "bg-destructive/10 border-destructive/20 text-destructive"}`}>
                    {actionMsg.msg}
                </div>
            )}

            {/* Create User Form Panel */}
            {showCreateForm && (
                <div className="mb-6 bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-semibold text-foreground">Add New User</h2>
                        <button onClick={() => { setShowCreateForm(false); setCreateError(""); }} className="text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <form onSubmit={handleCreate} className="space-y-4">
                        {createError && (
                            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">{createError}</div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5 block">Full Name</label>
                                <input
                                    id="new-user-name"
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Jane Smith"
                                    required
                                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5 block">Email</label>
                                <input
                                    id="new-user-email"
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="jane@company.com"
                                    required
                                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5 block">Role</label>
                                <select
                                    id="new-user-role"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value as "admin" | "user")}
                                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-1">
                            <button
                                id="create-user-submit"
                                type="submit"
                                disabled={createLoading}
                                className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity"
                            >
                                {createLoading ? "Creating..." : "Create User"}
                            </button>
                            <button type="button" onClick={() => { setShowCreateForm(false); setCreateError(""); }} className="px-5 py-2 border border-border text-sm rounded-lg hover:bg-muted transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Temp Password Modal */}
            {tempModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-foreground">User Created!</h2>
                                <p className="text-xs text-muted-foreground">Share the temp password with the user</p>
                            </div>
                        </div>

                        <div className="bg-muted rounded-lg p-4 mb-5 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Name</span>
                                <span className="font-medium text-foreground">{tempModal.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Email</span>
                                <span className="font-medium text-foreground">{tempModal.email}</span>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-widest">Temporary Password</p>
                        <div className="flex items-center gap-2 bg-brand-dark rounded-lg px-4 py-3 mb-2">
                            <code className="text-brand-mint font-mono text-lg font-bold flex-1 select-all">{tempModal.tempPassword}</code>
                            <button onClick={handleCopy} className="text-brand-mint/70 hover:text-brand-mint transition-colors">
                                {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-destructive mb-6">⚠️ This password will not be shown again. Copy it now.</p>

                        <button
                            id="close-temp-modal"
                            onClick={() => { setTempModal(null); setCopied(false); }}
                            className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            I've noted the password
                        </button>
                    </div>
                </div>
            )}

            {/* Loading / Error / Empty */}
            {loading && <div className="flex items-center justify-center py-20 text-muted-foreground text-sm"><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Loading users...</div>}
            {!loading && error && <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">{error}</div>}
            {!loading && !error && users.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Users className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm font-medium">No users yet</p>
                </div>
            )}

            {/* Table */}
            {!loading && !error && users.length > 0 && (
                <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50 text-left">
                                <th className="px-5 py-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">User</th>
                                <th className="px-5 py-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Role</th>
                                <th className="px-5 py-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Status</th>
                                <th className="px-5 py-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                                                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground flex items-center gap-2">
                                                    {user.name}
                                                    {user.mustChangePassword && (
                                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-200">
                                                            Temp password
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                            <Shield className="w-3 h-3" />{user.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${user.active ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                                            {user.active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                            {user.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 justify-end">
                                            <button id={`toggle-role-${user.id}`} onClick={() => handleRoleToggle(user)} disabled={busy === user.id + "_role"} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50">
                                                {user.role === "admin" ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                                {user.role === "admin" ? "Demote" : "Make Admin"}
                                            </button>
                                            <button id={`toggle-active-${user.id}`} onClick={() => handleActiveToggle(user)} disabled={busy === user.id + "_active"} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${user.active ? "border border-destructive/30 text-destructive hover:bg-destructive/10" : "border border-accent text-accent-foreground hover:bg-accent/20"}`}>
                                                {user.active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
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
