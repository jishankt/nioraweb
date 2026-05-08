import { useEffect, useState } from 'react';
import { Eye, X, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import AdminShell from '../../components/AdminShell.jsx';
import { fetchOrders, updateOrderStatus, OWNER_WHATSAPP_NUMBER } from '../../services/api.js';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0);

const STATUSES = ['pending', 'contacted', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewing, setViewing] = useState(null);

  const load = () => {
    setLoading(true);
    fetchOrders()
      .then((data) => setOrders(data.results || data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    load();
    if (viewing?.id === id) setViewing((v) => ({ ...v, status }));
  };

  return (
    <AdminShell title="Orders">
      <div className="adm-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`adm-btn ${filter === s ? 'adm-btn--primary' : 'adm-btn--ghost'}`}
            >
              {s === 'all' ? 'All' : s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="adm-card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(15,58,50,0.5)' }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="adm-empty"><p>No orders here yet.</p></div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td><strong>{o.customer_name || 'Guest'}</strong></td>
                  <td style={{ fontSize: '0.82rem' }}>{o.customer_phone || '—'}</td>
                  <td>{o.items?.length || 0}</td>
                  <td><strong>{formatINR(o.total_amount)}</strong></td>
                  <td>
                    <select
                      className="adm-select"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', maxWidth: 130 }}
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'rgba(15,58,50,0.6)' }}>
                    {new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <button onClick={() => setViewing(o)} className="adm-btn adm-btn--ghost adm-btn--icon">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewing && (
        <div className="adm-modal">
          <div className="adm-modal__backdrop" onClick={() => setViewing(null)} />
          <div className="adm-modal__panel">
            <button className="adm-modal__close" onClick={() => setViewing(null)}><X size={20} /></button>
            <span className="eyebrow">— Order #{viewing.id} —</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--niora-emerald)', margin: '0.4rem 0 1.4rem' }}>
              {viewing.customer_name || 'Guest order'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.4rem' }}>
              {viewing.customer_phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
                  <Phone size={15} strokeWidth={1.6} style={{ color: 'var(--niora-emerald)' }} />
                  {viewing.customer_phone}
                </div>
              )}
              {viewing.customer_email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
                  <Mail size={15} strokeWidth={1.6} style={{ color: 'var(--niora-emerald)' }} />
                  {viewing.customer_email}
                </div>
              )}
              {viewing.customer_address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', gridColumn: '1 / -1' }}>
                  <MapPin size={15} strokeWidth={1.6} style={{ color: 'var(--niora-emerald)', marginTop: 2 }} />
                  {viewing.customer_address}
                </div>
              )}
              {viewing.note && (
                <div style={{ gridColumn: '1 / -1', background: 'var(--niora-paper-2)', padding: '0.8rem 1rem', borderRadius: 6, fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                  "{viewing.note}"
                </div>
              )}
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--niora-emerald)', marginBottom: '0.8rem' }}>
              Items
            </h3>
            <table className="adm-table">
              <thead>
                <tr><th>Item</th><th>Variant</th><th>Qty</th><th style={{ textAlign: 'right' }}>Subtotal</th></tr>
              </thead>
              <tbody>
                {viewing.items?.map((it, i) => (
                  <tr key={i}>
                    <td>{it.product_name_snapshot}</td>
                    <td style={{ fontSize: '0.78rem', color: 'rgba(15,58,50,0.6)' }}>
                      {[it.size, it.color].filter(Boolean).join(' / ') || '—'}
                    </td>
                    <td>{it.quantity}</td>
                    <td style={{ textAlign: 'right', fontWeight: 500 }}>{formatINR(it.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'right', fontWeight: 500, paddingTop: '1rem' }}>Total</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, fontSize: '1.1rem', color: 'var(--niora-emerald)', paddingTop: '1rem' }}>
                    {formatINR(viewing.total_amount)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.6rem', justifyContent: 'flex-end' }}>
              {viewing.customer_phone && (
                <a
                  className="adm-btn adm-btn--ghost"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://wa.me/${viewing.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${viewing.customer_name || 'there'}, regarding NIORA order #${viewing.id}…`)}`}
                >
                  <MessageCircle size={14} /> Reply on WhatsApp
                </a>
              )}
              <button className="adm-btn adm-btn--primary" onClick={() => setViewing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminOrders;
