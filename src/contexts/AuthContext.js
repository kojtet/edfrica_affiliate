'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
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
      return;
    }

    setToken(token);
    localStorage.setItem('token', token);

    // Set the affiliate data as the user
    setUser(affiliate);
    setUserID(affiliate.id);
    localStorage.setItem('affiliate', JSON.stringify(affiliate));

    router.push('/');
  };

  const logout = () => {
    setUser(null);
    setUserID(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('affiliate');
    router.push('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedAffiliate = localStorage.getItem('affiliate');
    if (storedToken && storedAffiliate) {
      const affiliate = JSON.parse(storedAffiliate);
      const decodedToken = decodeToken(storedToken);
      if (decodedToken && !isTokenExpired(decodedToken.exp)) {
        setUser(affiliate);
        setUserID(affiliate.id);
        setToken(storedToken);
      } else {
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = decodedToken.exp - currentTime;
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
