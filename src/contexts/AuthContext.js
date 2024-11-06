// src/contexts/AuthContext.js

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userID,setUserID] = useState(null)
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  const isTokenExpired = (exp) => {
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return now > exp;
  };

  const login = (data) => {
    // Extract token and affiliate from response data
    const { token, affiliate } = data;
  
    if (!token || !affiliate) {
      console.error('Token or affiliate data not found in response.');
      setError('Failed to log in. Please try again.');
      return;
    }
  
    setToken(token);
    localStorage.setItem('token', token);
  
    // Decode the token to get additional user info if needed
    const decodedToken = decodeToken(token);

  
    // Set the affiliate data as the user
    setUser(affiliate);
    setUserID(affiliate.id)
  
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedUser = decodeToken(storedToken);
      if (decodedUser && !isTokenExpired(decodedUser.exp)) {
        setUser(decodedUser);
        setToken(storedToken);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser && decodedUser.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = decodedUser.exp - currentTime;
        if (timeLeft > 0) {
          const timeout = setTimeout(() => {
            logout();
          }, timeLeft * 1000);
          return () => clearTimeout(timeout);
        } else {
          logout();
        }
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ userID, user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
