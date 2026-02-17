import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CareerPrediction from './pages/CareerPrediction';
import ResumeAnalysis from './pages/ResumeAnalysis';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import PhaseDetail from './pages/PhaseDetail';
import FullRoadmap from './pages/FullRoadmap';
import RoadmapOverview from './pages/RoadmapOverview';

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

            {/* New Interactive Roadmap Routes */}
            <Route
                path="/roadmap/overview"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <RoadmapOverview />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/roadmap/phase/:phaseId"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <PhaseDetail />
                        </Layout>
                    </ProtectedRoute>
                }
            />

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
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Settings />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/roadmap/full"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <FullRoadmap />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/roadmap/:phaseId"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <PhaseDetail />
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
                <ThemeProvider>
                    <AppContent />
                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;

