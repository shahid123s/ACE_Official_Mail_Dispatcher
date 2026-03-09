import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { changePasswordRequest } from "../lib/api";
import { usePageTitle } from "../hooks/usePageTitle";

const ChangePasswordPage = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    usePageTitle("Set New Password");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 8) {
            return setError("New password must be at least 8 characters.");
        }
        if (newPassword !== confirmPassword) {
            return setError("Passwords do not match.");
        }
        if (newPassword === currentPassword) {
            return setError("New password must be different from your temp password.");
        }

        setLoading(true);
        try {
            await changePasswordRequest(token!, currentPassword, newPassword);
            // Log out so they log in fresh with new password
            logout();
            navigate("/login", { state: { message: "Password changed! Please log in with your new password." } });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary px-8 py-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-brand-mint rounded-xl flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-brand-dark" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Set New Password</h1>
                                <p className="text-white/60 text-xs">ACE Mail · First-time setup</p>
                            </div>
                        </div>
                        <p className="text-white/80 text-sm mt-4 leading-relaxed">
                            Your account was created with a temporary password.
                            Please set a new password to continue.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                                {error}
                            </div>
                        )}

                        {/* Temp password */}
                        <div>
                            <label className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5 block">
                                Temporary Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    id="change-current-password"
                                    type={showCurrent ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter your temp password"
                                    required
                                    className="w-full pl-9 pr-10 py-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* New password */}
                        <div>
                            <label className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5 block">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    id="change-new-password"
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    required
                                    className="w-full pl-9 pr-10 py-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm */}
                        <div>
                            <label className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5 block">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    id="change-confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                    required
                                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                                />
                            </div>
                        </div>

                        <button
                            id="change-password-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            {loading ? "Saving..." : "Set New Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
