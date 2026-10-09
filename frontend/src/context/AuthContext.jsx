import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vitalwatch_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default fallback receptionist user for instant access
    return {
      id: 'USR-REC-01',
      name: 'Eleanor Jenkins',
      role: 'receptionist',
      email: 'reception.desk@vitalwatch.hospital',
      roleTitle: 'Hospital Admissions Officer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('vitalwatch_token') || 'demo-token');

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('vitalwatch_user', JSON.stringify(userData));
    localStorage.setItem('vitalwatch_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vitalwatch_user');
    localStorage.removeItem('vitalwatch_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
