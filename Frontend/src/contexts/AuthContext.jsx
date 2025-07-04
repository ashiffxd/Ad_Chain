
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:5001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000, // 5-second timeout
        })
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching user:', err.message);
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Login request:', { email });
      const res = await axios.post('http://localhost:5001/api/users/login', { email, password }, { timeout: 5000 });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error('Login error:', err);
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (userData) => {
    try {
      console.log('Signup request:', userData);
      const res = await axios.post('http://localhost:5001/api/users/signup', userData, { timeout: 5000 });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error('Signup error:', err);
      throw new Error(err.response?.data?.message || 'Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}