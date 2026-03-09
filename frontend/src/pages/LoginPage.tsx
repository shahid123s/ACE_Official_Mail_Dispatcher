import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../lib/api";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = (location.state as { message?: string })?.message;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await loginRequest(email, password);
            login(data.token, data.user);
            if (data.mustChangePassword) {
                navigate("/change-password");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary px-8 py-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-brand-mint rounded-xl flex items-center justify-center">
                                <Mail className="w-5 h-5 text-brand-dark" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">ACE Mail</h1>
                                <p className="text-white/60 text-xs">Official Mail Dispatcher</p>
                            </div>
                        </div>
                        <p className="text-white/80 text-sm mt-4">
                            Sign in to send official emails on behalf of your organisation.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
                        {successMessage && (
                            <div className="text-sm text-primary bg-primary/10 border border-primary/20 rounded-lg px-4 py-3">
                                {successMessage}
                            </div>
                        )}
                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    required
                                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    id="login-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                                />
                            </div>
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
                        >
                            <LogIn className="w-4 h-4" />
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-4">
                    Don't have an account? Contact your administrator.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
