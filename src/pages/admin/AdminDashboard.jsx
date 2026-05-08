import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, MessageSquare, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';
import AdminShell from '../../components/AdminShell.jsx';
import { fetchDashboardStats, fetchOrders, fetchEnquiries } from '../../services/api.js';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDashboardStats().catch(() => null),
      fetchOrders().catch(() => ({ results: [] })),
      fetchEnquiries().catch(() => ({ results: [] })),
    ]).then(([s, o, e]) => {
      setStats(s);
      setRecentOrders((o.results || o || []).slice(0, 5));
      setRecentEnquiries((e.results || e || []).slice(0, 5));
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: 'Active Products', value: stats?.active_products ?? '—', sub: `${stats?.total_products ?? 0} total in catalogue`, Icon: Package },
    { label: 'Orders', value: stats?.total_orders ?? '—', sub: `${stats?.pending_orders ?? 0} pending`, Icon: ShoppingCart },
    { label: 'Enquiries', value: stats?.total_enquiries ?? '—', sub: `${stats?.new_enquiries ?? 0} new`, Icon: MessageSquare },
    { label: 'Out of Stock', value: stats?.out_of_stock ?? '—', sub: 'Restock to keep selling', Icon: AlertCircle },
    { label: 'Total Revenue', value: formatINR(stats?.total_revenue ?? 0), sub: 'Confirmed + delivered', Icon: TrendingUp, span: 2 },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="adm-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
        {cards.map((c, i) => (
          <div key={i} className="adm-stat" style={c.span ? { gridColumn: `span ${c.span}` } : {}}>
            <div className="flex items-center justify-between">
              <span className="adm-stat__label">{c.label}</span>
              <c.Icon size={18} strokeWidth={1.5} style={{ color: 'var(--niora-emerald)', opacity: 0.5 }} />
            </div>
            <div className="adm-stat__value">{loading ? '…' : c.value}</div>
            <div className="adm-stat__sub">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="adm-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="adm-card">
          <div className="adm-card__head">
            <h3 className="adm-card__title">Recent Orders</h3>
            <Link to="/admin/orders" className="adm-btn adm-btn--ghost">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="adm-empty"><p>No orders yet.</p></div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr><th>#</th><th>Customer</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.customer_name || 'Guest'}</td>
                    <td>{formatINR(o.total_amount)}</td>
                    <td><span className={`adm-status adm-status--${o.status}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="adm-card">
          <div className="adm-card__head">
            <h3 className="adm-card__title">Recent Enquiries</h3>
            <Link to="/admin/enquiries" className="adm-btn adm-btn--ghost">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <div className="adm-empty"><p>No enquiries yet.</p></div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr><th>From</th><th>Subject</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentEnquiries.map((e) => (
                  <tr key={e.id}>
                    <td>{e.name}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {e.subject || e.message?.slice(0, 40) + '…'}
                    </td>
                    <td><span className={`adm-status adm-status--${e.status}`}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminDashboard;
