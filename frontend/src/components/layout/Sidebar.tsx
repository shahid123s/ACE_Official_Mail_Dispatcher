import { NavLink, useNavigate } from "react-router-dom";
import { Mail, Send, Users, LogOut, Megaphone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
    { label: "Compose", to: "/", icon: Mail, exact: true },
    { label: "Sent", to: "/sent", icon: Send },
];

const adminItems = [
    { label: "Users", to: "/users", icon: Users },
];

const Sidebar = () => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
            ? "bg-sidebar-active text-sidebar-fg"
            : "text-sidebar-fg/70 hover:bg-sidebar-hover hover:text-sidebar-fg"
        }`;

    return (
        <aside className="w-56 bg-sidebar-bg text-sidebar-fg flex flex-col min-h-screen shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 py-5">
                <div className="w-8 h-8 bg-brand-mint rounded-lg flex items-center justify-center">
                    <Megaphone className="w-4 h-4 text-brand-dark" />
                </div>
                <span className="font-bold text-lg tracking-tight">ACE Mail</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 mt-2 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        className={linkClass}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </NavLink>
                ))}

                {isAdmin && (
                    <>
                        <div className="pt-3 pb-1 px-3">
                            <span className="text-[10px] font-semibold text-sidebar-fg/40 tracking-widest uppercase">
                                Admin
                            </span>
                        </div>
                        {adminItems.map((item) => (
                            <NavLink key={item.to} to={item.to} className={linkClass}>
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </NavLink>
                        ))}
                    </>
                )}
            </nav>

            {/* Logout */}
            <div className="px-3 mb-3">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-fg/70 hover:bg-sidebar-hover hover:text-sidebar-fg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>

            {/* User info */}
            {user && (
                <div className="px-5 py-4 border-t border-sidebar-fg/10 flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-mint/30 rounded-full flex items-center justify-center text-xs font-semibold text-sidebar-fg">
                        {getInitials(user.name)}
                    </div>
                    <div className="text-xs min-w-0">
                        <div className="font-semibold truncate">{user.name}</div>
                        <div className="text-sidebar-fg/60 capitalize">{user.role}</div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
