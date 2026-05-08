import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        minHeight: '70vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: 'var(--niora-emerald)', fontFamily: 'var(--font-serif)',
        fontStyle: 'italic', fontSize: '1.2rem'
      }}>
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

export default ProtectedRoute;
