import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  user: { token: '', userId: '' },
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
  getRole: () => { },
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: sessionStorage.getItem('token') || '',
    userId: sessionStorage.getItem('userId') || '',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (token && userId) {
      try {
        const decoded = jwtDecode(token);
        console.log('AuthContext: Initial token decode:', decoded);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          console.log('AuthContext: Token expired', { userId, exp: decoded.exp });
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('userId');
          localStorage.removeItem('rememberMe');
          setIsAuthenticated(false);
          setUser({ token: '', userId: '' });
        } else {
          setIsAuthenticated(true);
          setUser({ token, userId });
          console.log('AuthContext: Restored session', { userId, role: decoded.role });
        }
      } catch (error) {
        console.error('AuthContext: Error decoding JWT on init:', error.message);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        localStorage.removeItem('rememberMe');
        setIsAuthenticated(false);
        setUser({ token: '', userId: '' });
      }
    } else {
      setIsAuthenticated(false);
      setUser({ token: '', userId: '' });
    }
    setLoading(false);
  }, []);

  const login = (token, userId, rememberMe) => {
    try {
      const decoded = jwtDecode(token);
      console.log('AuthContext: Login decoded token:', { userId, role: decoded.role });
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('authToken', token); // Store token for remember me
        localStorage.setItem('userId', userId);   // Store userId for remember me
      }
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', userId);
      setUser({ token, userId });
      setIsAuthenticated(true);
      console.log('AuthContext: Logged in', { userId, role: decoded.role, rememberMe });
    } catch (error) {
      console.error('AuthContext: Error decoding JWT on login:', error.message);
      throw new Error('Invalid token received');
    }
  };

  const logout = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');

    // Clear localStorage (for Remember Me functionality)
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');

    // Reset state
    setUser({ token: '', userId: '' });
    setIsAuthenticated(false);
    console.log('AuthContext: Logged out - cleared all storage');
  };

  const getRole = () => {
    if (user.token) {
      try {
        const decoded = jwtDecode(user.token);
        console.log('AuthContext: getRole decoded token:', decoded);
        return decoded.role || 'customer';
      } catch (error) {
        console.error('AuthContext: Error decoding JWT for role:', error.message);
        return 'customer';
      }
    }
    return 'customer';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, getRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
