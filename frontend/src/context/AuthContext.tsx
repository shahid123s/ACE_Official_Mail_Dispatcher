import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("ace_token")
    );
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem("ace_user");
        return stored ? JSON.parse(stored) : null;
    });

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem("ace_token", newToken);
        localStorage.setItem("ace_user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem("ace_token");
        localStorage.removeItem("ace_user");
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        // Sync across tabs
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "ace_token" && !e.newValue) logout();
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token,
                isAdmin: user?.role === "admin",
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
