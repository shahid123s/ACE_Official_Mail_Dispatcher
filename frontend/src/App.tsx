import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import AdminRoute from "./components/guards/AdminRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import ComposePage from "./pages/ComposePage";
import SentPage from "./pages/SentPage";
import UsersPage from "./pages/UsersPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* First-login password change — requires token but no full guard */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />

          {/* Protected layout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ComposePage />} />
            <Route path="sent" element={<SentPage />} />
            <Route
              path="users"
              element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              }
            />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
