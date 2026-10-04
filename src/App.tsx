import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Registry } from './pages/Registry';
import { Studies } from './pages/Studies';
import { Candidates } from './pages/Candidates';
import { Benchmarks } from './pages/Benchmarks';
import { Decisions } from './pages/Decisions';
import { Runtimes } from './pages/Runtimes';
import { Docs } from './pages/Docs';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

interface AppProps {
  /** Default dashboard theme. Sign-in screens always render light. */
  defaultTheme?: 'light' | 'dark';
  /** Skip the sign-in screen and open the workspace directly. */
  startSignedIn?: boolean;
}

function GuestOnly({ children }: {children: React.ReactNode;}) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

function AppToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} position="bottom-right" richColors closeButton />;
}

export function App({ defaultTheme = 'light', startSignedIn = false }: AppProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <AuthProvider startSignedIn={startSignedIn}>
        <WorkspaceProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={
                <GuestOnly>
                    <Login />
                  </GuestOnly>
                } />
              
              <Route
                path="/signup"
                element={
                <GuestOnly>
                    <Signup />
                  </GuestOnly>
                } />
              
              <Route
                element={
                <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                
                <Route path="/" element={<Dashboard />} />
                <Route path="/registry" element={<Registry />} />
                <Route path="/studies" element={<Studies />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/benchmarks" element={<Benchmarks />} />
                <Route path="/decisions" element={<Decisions />} />
                <Route path="/runtimes" element={<Runtimes />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <AppToaster />
          </BrowserRouter>
        </WorkspaceProvider>
      </AuthProvider>
    </ThemeProvider>);

}