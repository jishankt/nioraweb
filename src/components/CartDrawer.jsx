import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { submitOrder, OWNER_WHATSAPP_NUMBER } from '../services/api.js';
import './CartDrawer.css';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

const CartDrawer = () => {
  const {
    items, isOpen, closeCart, updateQty, removeItem, totalAmount,
    totalQuantity, clearCart, itemKey,
  } = useCart();

  const [step, setStep] = useState('cart'); // cart | details
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const buildWhatsAppMessage = (orderId) => {
    const lines = [];
    lines.push(`*New NIORA Order #${orderId || '—'}*`);
    lines.push('');
    lines.push(`*Customer:* ${form.name || 'Not provided'}`);
    if (form.phone) lines.push(`*Phone:* ${form.phone}`);
    if (form.address) lines.push(`*Address:* ${form.address}`);
    if (form.note) lines.push(`*Note:* ${form.note}`);
    lines.push('');
    lines.push('*Items:*');
    items.forEach((it, idx) => {
      const variant = [it.size, it.color].filter(Boolean).join(' / ');
      lines.push(
        `${idx + 1}. ${it.name}${variant ? ` (${variant})` : ''} — ${it.quantity} × ${formatINR(it.price)} = ${formatINR(it.quantity * it.price)}`
      );
    });
    lines.push('');
    lines.push(`*Total: ${formatINR(totalAmount)}*`);
    return encodeURIComponent(lines.join('\n'));
  };

  const handleCheckout = async (e) => {
    e?.preventDefault?.();
    setSubmitting(true);
    setError(null);
    try {
      // Save order to backend
      const payload = {
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        note: form.note,
        total_amount: totalAmount,
        sent_to_whatsapp: true,
        items: items.map((it) => ({
          product: it.product_id,
          product_name_snapshot: it.name,
          price_snapshot: it.price,
          quantity: it.quantity,
          size: it.size || '',
          color: it.color || '',
        })),
      };
      let orderId = null;
      try {
        const order = await submitOrder(payload);
        orderId = order.id;
      } catch (err) {
        // Even if API fails, we still allow WhatsApp redirect (offline-friendly)
        console.warn('Order save failed, continuing to WhatsApp', err);
      }

      const message = buildWhatsAppMessage(orderId);
      const waUrl = `https://wa.me/91${OWNER_WHATSAPP_NUMBER}?text=${message}`;
      window.open(waUrl, '_blank');
      clearCart();
      setStep('cart');
      setForm({ name: '', phone: '', address: '', note: '' });
      closeCart();
    } catch (err) {
      setError('Could not submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="drawer__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
          >
            <header className="drawer__header">
              <div>
                <span className="eyebrow">Your bag</span>
                <h3 className="drawer__title">
                  {step === 'cart' ? 'Shopping Cart' : 'Checkout Details'}
                </h3>
              </div>
              <button className="drawer__close" onClick={closeCart} aria-label="Close cart">
                <X size={22} strokeWidth={1.5} />
              </button>
            </header>

            {step === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="drawer__empty">
                    <ShoppingBag size={56} strokeWidth={0.8} />
                    <p className="serif-italic" style={{ fontSize: '1.4rem' }}>
                      Your cart is quietly waiting.
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(15,58,50,0.6)' }}>
                      Browse the collection to begin.
                    </p>
                    <button className="btn btn--primary" onClick={closeCart}>
                      Discover the Collection
                    </button>
                  </div>
                ) : (
                  <>
                    <ul className="drawer__items">
                      {items.map((it) => {
                        const k = itemKey(it);
                        return (
                          <motion.li
                            key={k}
                            className="drawer__item"
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                          >
                            <div className="drawer__item-img">
                              {it.image ? (
                                <img src={it.image} alt={it.name} />
                              ) : (
                                <div className="drawer__item-img--placeholder" />
                              )}
                            </div>
                            <div className="drawer__item-body">
                              <h4 className="drawer__item-name">{it.name}</h4>
                              <div className="drawer__item-meta">
                                {it.size && <span>Size {it.size}</span>}
                                {it.color && <span>{it.color}</span>}
                              </div>
                              <div className="drawer__item-bottom">
                                <div className="qty">
                                  <button
                                    onClick={() => updateQty(k, it.quantity - 1)}
                                    aria-label="decrease"
                                  ><Minus size={14} /></button>
                                  <span>{it.quantity}</span>
                                  <button
                                    onClick={() => updateQty(k, it.quantity + 1)}
                                    aria-label="increase"
                                  ><Plus size={14} /></button>
                                </div>
                                <span className="drawer__item-price">
                                  {formatINR(it.price * it.quantity)}
                                </span>
                              </div>
                            </div>
                            <button
                              className="drawer__item-remove"
                              onClick={() => removeItem(k)}
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} strokeWidth={1.5} />
                            </button>
                          </motion.li>
                        );
                      })}
                    </ul>

                    <footer className="drawer__footer">
                      <div className="drawer__totals">
                        <span>Subtotal ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span>
                        <strong>{formatINR(totalAmount)}</strong>
                      </div>
                      <p className="drawer__note">
                        We'll send your order directly to NIORA on WhatsApp for confirmation. No login needed.
                      </p>
                      <button
                        className="btn btn--primary btn--block"
                        onClick={() => setStep('details')}
                      >
                        Continue to Checkout
                      </button>
                    </footer>
                  </>
                )}
              </>
            )}

            {step === 'details' && (
              <form onSubmit={handleCheckout} className="drawer__form">
                <p className="drawer__form-intro">
                  Just your details. We'll confirm everything on WhatsApp.
                </p>
                <div className="field">
                  <label>Your Name *</label>
                  <input
                    name="name" required value={form.name}
                    onChange={handleField} placeholder="Full name"
                  />
                </div>
                <div className="field">
                  <label>Phone *</label>
                  <input
                    name="phone" required value={form.phone}
                    onChange={handleField} placeholder="WhatsApp number"
                  />
                </div>
                <div className="field">
                  <label>Delivery Address</label>
                  <textarea
                    name="address" value={form.address}
                    onChange={handleField}
                    placeholder="House, street, city, pincode"
                  />
                </div>
                <div className="field">
                  <label>Note (optional)</label>
                  <textarea
                    name="note" value={form.note}
                    onChange={handleField}
                    placeholder="Anything else we should know?"
                  />
                </div>

                {error && <p className="drawer__error">{error}</p>}

                <div className="drawer__totals">
                  <span>Total</span>
                  <strong>{formatINR(totalAmount)}</strong>
                </div>

                <div className="drawer__form-actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setStep('cart')}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={submitting || !form.name || !form.phone}
                  >
                    {submitting ? 'Sending…' : 'Send to WhatsApp'}
                  </button>
                </div>
              </form>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
