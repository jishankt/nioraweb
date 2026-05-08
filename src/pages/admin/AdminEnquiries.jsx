import { useEffect, useState } from 'react';
import { Eye, X, Phone, Mail, MessageCircle } from 'lucide-react';
import AdminShell from '../../components/AdminShell.jsx';
import { fetchEnquiries, updateEnquiryStatus } from '../../services/api.js';

const STATUSES = ['new', 'read', 'responded', 'closed'];

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewing, setViewing] = useState(null);

  const load = () => {
    setLoading(true);
    fetchEnquiries()
      .then((data) => setEnquiries(data.results || data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all'
    ? enquiries
    : enquiries.filter((e) => e.status === filter);

  const handleStatusChange = async (id, status) => {
    await updateEnquiryStatus(id, status);
    load();
    if (viewing?.id === id) setViewing((v) => ({ ...v, status }));
  };

  const openEnquiry = async (e) => {
    setViewing(e);
    if (e.status === 'new') {
      await updateEnquiryStatus(e.id, 'read');
      load();
    }
  };

  return (
    <AdminShell title="Enquiries">
      <div className="adm-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`adm-btn ${filter === s ? 'adm-btn--primary' : 'adm-btn--ghost'}`}
            >
              {s === 'all' ? 'All' : s} {s !== 'all' && `(${enquiries.filter(e => e.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="adm-card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(15,58,50,0.5)' }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="adm-empty"><p>No enquiries here yet.</p></div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Contact</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} style={{ fontWeight: e.status === 'new' ? 500 : 400 }}>
                  <td><strong>{e.name}</strong></td>
                  <td style={{ fontSize: '0.82rem' }}>
                    {e.phone && <div>{e.phone}</div>}
                    {e.email && <div style={{ color: 'rgba(15,58,50,0.6)' }}>{e.email}</div>}
                  </td>
                  <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.subject || e.message?.slice(0, 50) + '…'}
                  </td>
                  <td>
                    <select
                      className="adm-select"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', maxWidth: 120 }}
                      value={e.status}
                      onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'rgba(15,58,50,0.6)' }}>
                    {new Date(e.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <button onClick={() => openEnquiry(e)} className="adm-btn adm-btn--ghost adm-btn--icon">
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
            <span className="eyebrow">— Enquiry from —</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--niora-emerald)', margin: '0.4rem 0 1rem' }}>
              {viewing.name}
            </h2>

            <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
              {viewing.phone && (
                <a href={`tel:${viewing.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--niora-emerald)' }}>
                  <Phone size={15} strokeWidth={1.6} /> {viewing.phone}
                </a>
              )}
              {viewing.email && (
                <a href={`mailto:${viewing.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--niora-emerald)' }}>
                  <Mail size={15} strokeWidth={1.6} /> {viewing.email}
                </a>
              )}
            </div>

            {viewing.subject && (
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--niora-emerald)', marginBottom: '0.6rem' }}>
                {viewing.subject}
              </h3>
            )}
            <div style={{ background: 'var(--niora-paper-2)', padding: '1.2rem 1.4rem', borderRadius: 8, fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {viewing.message}
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.6rem', justifyContent: 'flex-end' }}>
              {viewing.phone && (
                <a
                  className="adm-btn adm-btn--ghost"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://wa.me/${viewing.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${viewing.name}, thanks for reaching out to NIORA…`)}`}
                >
                  <MessageCircle size={14} /> Reply on WhatsApp
                </a>
              )}
              {viewing.email && (
                <a className="adm-btn adm-btn--ghost" href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject || 'Your enquiry')}`}>
                  <Mail size={14} /> Reply by Email
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

export default AdminEnquiries;
