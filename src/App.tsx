
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/auth/authcontext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import { AdminLayout } from "@/components/AdminLayout";
import { ROLES } from "@/auth/roles";
import LLMInstructions from "./pages/LLMInstructions";
import Billing from "./pages/Billing";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/" element={<Navigate to="/instructions" replace />} />

                    {/* Instructions: all authenticated users */}
                    <Route path="/instructions" element={<LLMInstructions />} />

                    {/* Billing: billing-capable roles only */}
                    <Route path="/billing" element={
                      <RoleProtectedRoute allowedRoles={[ROLES.BOUC_ADMIN, ROLES.BOUC_FINANCE, ROLES.BOUC_USER, ROLES.ORG_ADMIN, ROLES.ORG_ADMIN_ENTERPRISE]}>
                        <Billing />
                      </RoleProtectedRoute>
                    } />

                    {/* Settings: all authenticated users */}
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
