import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            // Decode token or just set a dummy user state so ProtectedRoute doesn't redirect
            // Ideally, you would call an endpoint like /api/auth/me here
            setUser({ email: 'user@example.com' });
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            // Adjust API URL based on your setup. Assuming proxy or full URL.
            const response = await axios.post('http://localhost:8000/api/auth/login',
                new URLSearchParams({ username: email, password: password }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
            );

            const accessToken = response.data.access_token;
            setToken(accessToken);
            // Decode token or fetch user details here if needed. 
            // For now just setting a flag or email
            setUser({ email });
            navigate('/dashboard');
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return { success: false, error: error.response?.data?.detail || "Login failed" };
        }
    };

    const register = async (fullName, email, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/register', {
                full_name: fullName,
                email,
                password
            });
            const accessToken = response.data.access_token;
            setToken(accessToken);
            setUser({ email, fullName });
            navigate('/dashboard');
            return { success: true };
        } catch (error) {
            console.error("Registration failed", error);
            return { success: false, error: error.response?.data?.detail || "Registration failed" };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
