import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import nioraWordmark from '../assets/niora-wordmark.png';
import './AdminLayout.css';

const AdminShell = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <img src={nioraWordmark} alt="NIORA" className="admin__wordmark-img" />
          <span className="admin__brand-tag">Atelier Console</span>
        </div>

        <nav className="admin__nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin__nav-link ${isActive ? 'is-active' : ''}`}>
            <LayoutDashboard size={17} strokeWidth={1.6} /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `admin__nav-link ${isActive ? 'is-active' : ''}`}>
            <Package size={17} strokeWidth={1.6} /> Products
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `admin__nav-link ${isActive ? 'is-active' : ''}`}>
            <ShoppingCart size={17} strokeWidth={1.6} /> Orders
          </NavLink>
          <NavLink to="/admin/enquiries" className={({ isActive }) => `admin__nav-link ${isActive ? 'is-active' : ''}`}>
            <MessageSquare size={17} strokeWidth={1.6} /> Enquiries
          </NavLink>
        </nav>

        <div className="admin__sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer" className="admin__nav-link">
            <ExternalLink size={15} strokeWidth={1.6} /> View Storefront
          </a>
          <div className="admin__user">
            <div>
              <div className="admin__user-name">{user?.username}</div>
              <div className="admin__user-role">Owner</div>
            </div>
            <button className="admin__logout" onClick={handleLogout} aria-label="Logout">
              <LogOut size={16} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </aside>

      <main className="admin__main">
        <header className="admin__header">
          <div>
            <span className="admin__eyebrow">— NIORA Console —</span>
            <h1 className="admin__title">{title}</h1>
          </div>
        </header>
        <div className="admin__content">{children}</div>
      </main>
    </div>
  );
};

export default AdminShell;
