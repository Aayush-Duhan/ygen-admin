import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login function that uses the AuthService
  async function login(email, password) {
    setError('');
    try {
      const user = await AuthService.login(email, password);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  function logout() {
    setCurrentUser(null);
    AuthService.logout();
  }

  const value = {
    currentUser,
    login,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}