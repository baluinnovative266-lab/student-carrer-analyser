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
        const fetchProfile = async (tk) => {
            setLoading(true);
            try {
                const response = await axios.get('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${tk}` }
                });
                setUser(response.data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                // If it's a 401, clear everything
                if (err.response?.status === 401) {
                    delete axios.defaults.headers.common['Authorization'];
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            fetchProfile(token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login',
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
            const response = await axios.post('/api/auth/register', {
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

    const updateProfile = async (data) => {
        try {
            await axios.post('/api/auth/update-profile', data);
            // Refresh user data
            const response = await axios.get('/api/auth/me');
            setUser(response.data);
            return { success: true };
        } catch (error) {
            console.error("Update profile failed", error);
            return { success: false, error: error.response?.data?.detail || "Update failed" };
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
