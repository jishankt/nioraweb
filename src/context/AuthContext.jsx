import { createContext, useContext, useEffect, useState } from 'react';
import { adminLogin, adminLogout, adminMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('niora_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    adminMe()
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem('niora_admin_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const data = await adminLogin(username, password);
    localStorage.setItem('niora_admin_token', data.token);
    setUser({ username: data.username, is_staff: data.is_staff });
    return data;
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('niora_admin_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
