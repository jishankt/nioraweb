import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Check, Instagram } from 'lucide-react';
import { submitEnquiry, OWNER_WHATSAPP_NUMBER } from '../services/api.js';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', subject: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const handleField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      await submitEnquiry(form);
      setDone(true);
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Could not send enquiry. Please try again or reach us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.main
      className="page-wrap contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className="contact-hero">
        <div className="container">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >— Say Hello —</motion.span>
          <motion.h1
            className="contact-hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Let's <span className="serif-italic">talk</span>
          </motion.h1>
          <motion.p
            className="contact-hero__sub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Questions, custom requests, or just want to say hi — we read every message ourselves.
          </motion.p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="contact-info__heading">
              We'd love<br /><span className="serif-italic">to hear from you</span>
            </h2>
            <p>
              The fastest way to reach us is WhatsApp — we usually reply within a few hours during business hours.
            </p>

            <ul className="contact-list">
              <li>
                <span className="contact-list__icon"><Phone size={18} strokeWidth={1.4} /></span>
                <div>
                  <span className="eyebrow">WhatsApp</span>
                  <a href={`https://wa.me/91${OWNER_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
                    +91 62357 45515
                  </a>
                </div>
              </li>
              <li>
                <span className="contact-list__icon"><Mail size={18} strokeWidth={1.4} /></span>
                <div>
                  <span className="eyebrow">Email</span>
                  <a href="mailto:hellonioraofficial@gmail.com">hellonioraofficial@gmail.com</a>
                </div>
              </li>
              <li>
                <span className="contact-list__icon"><Instagram size={18} strokeWidth={1.4} /></span>
                <div>
                  <span className="eyebrow">Instagram</span>
                  <a
                    href="https://www.instagram.com/niora_oficial?igsh=bzcxbjd3ZTRqdTd6"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @niora_oficial
                  </a>
                </div>
              </li>
              <li>
                <span className="contact-list__icon"><MapPin size={18} strokeWidth={1.4} /></span>
                <div>
                  <span className="eyebrow">Location</span>
                  <span>Calicut, Kerala — India</span>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {done ? (
              <div className="contact-success">
                <div className="contact-success__icon">
                  <Check size={28} strokeWidth={1.6} />
                </div>
                <h3>Thank you.</h3>
                <p>We've received your message and will get back to you shortly.</p>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setDone(false)}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h3 className="contact-form__title">Send a message</h3>
                <div className="contact-form__row">
                  <div className="field">
                    <label>Name *</label>
                    <input name="name" required value={form.name} onChange={handleField} />
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleField} />
                  </div>
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleField} />
                </div>
                <div className="field">
                  <label>Subject</label>
                  <input name="subject" value={form.subject} onChange={handleField} />
                </div>
                <div className="field">
                  <label>Message *</label>
                  <textarea name="message" required value={form.message} onChange={handleField} />
                </div>

                {error && <p className="drawer__error">{error}</p>}

                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={submitting}
                >
                  {submitting ? 'Sending…' : <>Send Message <Send size={15} /></>}
                </button>
              </>
            )}
          </motion.form>
        </div>
      </section>
    </motion.main>
  );
};

export default Contact;
