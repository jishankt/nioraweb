import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Minus, PlusCircle } from 'lucide-react';
import AdminShell from '../../components/AdminShell.jsx';
import {
  fetchAllProductsAdmin, fetchCategories, createProduct, updateProduct,
  deleteProduct, adjustStock, createCategory,
} from '../../services/api.js';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0);

const slugify = (s) =>
  (s || '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const emptyForm = {
  name: '', slug: '', category: '', description: '',
  price: '', discount_price: '', stock_quantity: 0,
  image_url: '', sizes: '', colors: '',
  is_featured: false, is_active: true,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | <slug>
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Categories quick-add
  const [newCategoryName, setNewCategoryName] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      fetchAllProductsAdmin(search ? { search } : {}),
      fetchCategories(),
    ]).then(([p, c]) => {
      setProducts(p.results || p || []);
      setCategories(c.results || c || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const onSearch = (e) => {
    e.preventDefault();
    load();
  };

  const openNew = () => {
    setForm(emptyForm);
    setImageFile(null);
    setError(null);
    setEditing('new');
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, slug: p.slug, category: p.category || '',
      description: p.description || '',
      price: p.price, discount_price: p.discount_price || '',
      stock_quantity: p.stock_quantity, image_url: p.image_url || '',
      sizes: p.sizes || '', colors: p.colors || '',
      is_featured: !!p.is_featured, is_active: !!p.is_active,
    });
    setImageFile(null);
    setError(null);
    setEditing(p.slug);
  };

  const handleField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      if (!payload.slug) payload.slug = slugify(payload.name);
      if (!payload.discount_price) delete payload.discount_price;
      if (!payload.category) delete payload.category;

      let data;
      if (imageFile) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
        });
        fd.append('image', imageFile);
        if (editing === 'new') data = await createProduct(fd);
        else data = await updateProduct(editing, fd);
      } else {
        if (editing === 'new') data = await createProduct(payload);
        else data = await updateProduct(editing, payload);
      }

      setEditing(null);
      load();
    } catch (err) {
      const detail = err.response?.data;
      setError(typeof detail === 'object' ? JSON.stringify(detail) : (detail || 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    await deleteProduct(p.slug);
    load();
  };

  const handleStockDelta = async (p, delta) => {
    await adjustStock(p.slug, delta);
    load();
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({
        name: newCategoryName.trim(),
        slug: slugify(newCategoryName),
      });
      setNewCategoryName('');
      load();
    } catch (err) {
      alert('Could not add category: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <AdminShell title="Products">
      <div className="adm-card" style={{ marginBottom: '1.5rem' }}>
        <div className="adm-card__head" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <form onSubmit={onSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: 240 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(15,58,50,0.4)' }} />
              <input
                className="adm-input"
                style={{ paddingLeft: 36 }}
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="adm-btn adm-btn--ghost">Search</button>
          </form>

          <button onClick={openNew} className="adm-btn adm-btn--primary">
            <Plus size={14} /> Add Product
          </button>
        </div>

        {/* Quick category add */}
        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
          <input
            className="adm-input"
            style={{ maxWidth: 260 }}
            placeholder="New category name…"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button type="submit" className="adm-btn adm-btn--ghost">+ Category</button>
          <span style={{ alignSelf: 'center', fontSize: '0.78rem', color: 'rgba(15,58,50,0.55)' }}>
            {categories.length} categories
          </span>
        </form>
      </div>

      <div className="adm-card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(15,58,50,0.5)' }}>Loading…</p>
        ) : products.length === 0 ? (
          <div className="adm-empty">
            <p>No products yet.</p>
            <button onClick={openNew} className="adm-btn adm-btn--primary">Add your first product</button>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th style={{ width: 160 }}>Stock</th>
                <th>Status</th>
                <th style={{ width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                      <div style={{
                        width: 44, height: 56, borderRadius: 4, overflow: 'hidden',
                        background: 'var(--niora-paper-2)', flexShrink: 0,
                      }}>
                        {(p.image || p.image_url) && (
                          <img src={p.image || p.image_url} alt={p.name}
                               style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--niora-emerald)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(15,58,50,0.5)' }}>{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{p.category_name || '—'}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{formatINR(p.discount_price || p.price)}</div>
                    {p.discount_price && (
                      <div style={{ fontSize: '0.72rem', textDecoration: 'line-through', color: 'rgba(15,58,50,0.4)' }}>
                        {formatINR(p.price)}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button className="adm-btn adm-btn--ghost adm-btn--icon"
                              onClick={() => handleStockDelta(p, -1)}
                              disabled={p.stock_quantity === 0}>
                        <Minus size={13} />
                      </button>
                      <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 500 }}>
                        {p.stock_quantity}
                      </span>
                      <button className="adm-btn adm-btn--ghost adm-btn--icon"
                              onClick={() => handleStockDelta(p, 1)}>
                        <PlusCircle size={13} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`adm-status adm-status--${p.is_active ? 'confirmed' : 'cancelled'}`}>
                      {p.is_active ? 'Active' : 'Hidden'}
                    </span>
                    {p.is_featured && (
                      <span className="adm-status adm-status--shipped" style={{ marginLeft: 4 }}>★</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(p)} className="adm-btn adm-btn--ghost adm-btn--icon">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(p)} className="adm-btn adm-btn--danger adm-btn--icon">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {editing && (
        <div className="adm-modal">
          <div className="adm-modal__backdrop" onClick={() => setEditing(null)} />
          <div className="adm-modal__panel">
            <button className="adm-modal__close" onClick={() => setEditing(null)}>
              <X size={20} />
            </button>
            <span className="eyebrow">{editing === 'new' ? '— Add product —' : '— Edit product —'}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--niora-emerald)', margin: '0.4rem 0 1.4rem' }}>
              {editing === 'new' ? 'New Piece' : form.name}
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="adm-field">
                <label>Name *</label>
                <input className="adm-input" name="name" value={form.name} onChange={handleField} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="adm-field">
                  <label>Slug</label>
                  <input className="adm-input" name="slug" value={form.slug} onChange={handleField}
                         placeholder={slugify(form.name) || 'auto-from-name'} />
                </div>
                <div className="adm-field">
                  <label>Category</label>
                  <select className="adm-select" name="category" value={form.category} onChange={handleField}>
                    <option value="">— None —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="adm-field">
                <label>Description</label>
                <textarea className="adm-textarea" name="description"
                          value={form.description} onChange={handleField} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="adm-field">
                  <label>Price (₹) *</label>
                  <input className="adm-input" type="number" step="0.01" name="price"
                         value={form.price} onChange={handleField} required />
                </div>
                <div className="adm-field">
                  <label>Sale Price (₹)</label>
                  <input className="adm-input" type="number" step="0.01" name="discount_price"
                         value={form.discount_price} onChange={handleField} />
                </div>
                <div className="adm-field">
                  <label>Stock Qty *</label>
                  <input className="adm-input" type="number" name="stock_quantity"
                         value={form.stock_quantity} onChange={handleField} required min="0" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="adm-field">
                  <label>Sizes (comma-separated)</label>
                  <input className="adm-input" name="sizes" placeholder="S,M,L,XL"
                         value={form.sizes} onChange={handleField} />
                </div>
                <div className="adm-field">
                  <label>Colors (comma-separated)</label>
                  <input className="adm-input" name="colors" placeholder="Black,Beige,Emerald"
                         value={form.colors} onChange={handleField} />
                </div>
              </div>

              <div className="adm-field">
                <label>Image URL (or upload below)</label>
                <input className="adm-input" name="image_url"
                       placeholder="https://…"
                       value={form.image_url} onChange={handleField} />
              </div>

              <div className="adm-field">
                <label>Upload Image</label>
                <input type="file" accept="image/*"
                       onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleField} />
                  Active (visible to customers)
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleField} />
                  Featured on homepage
                </label>
              </div>

              {error && <div style={{ background: '#fde0db', color: '#b03a1d', padding: '0.7rem 1rem', borderRadius: 6, fontSize: '0.85rem' }}>{error}</div>}

              <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setEditing(null)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : (editing === 'new' ? 'Create Product' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminProducts;
