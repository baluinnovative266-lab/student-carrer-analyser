import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CareerPrediction from './pages/CareerPrediction';
import ResumeAnalysis from './pages/ResumeAnalysis';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function AppContent() {
    return (
        <Routes>
            <Route path="/" element={
                <div className="flex flex-col min-h-screen bg-slate-900 text-white">
                    <Navbar />
                    <Home />
                </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/career-prediction"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <CareerPrediction />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/resume-analysis"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ResumeAnalysis />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            {/* Fallback or 404 */}
            <Route path="*" element={<Home />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;

