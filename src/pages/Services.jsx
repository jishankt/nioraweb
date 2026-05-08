import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Scissors, Sparkles, Truck, Ruler, ShieldCheck,
  ArrowRight, Phone, Clock, CheckCircle2,
} from 'lucide-react';
import { OWNER_WHATSAPP_NUMBER } from '../services/api.js';
import './Services.css';

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
};

const services = [
  {
    Icon: Scissors,
    title: 'Expert Alterations',
    desc: 'Hems, takes-in, takes-out, sleeve adjustments, and complete reshaping. Tailored by hand, returned with care.',
    points: ['Length & hem adjustments', 'Fit & shape refinement', 'Wedding & occasion wear'],
  },
  {
    Icon: Sparkles,
    title: 'Premium Laundry',
    desc: 'Gentle wash, fabric-safe finishing, and pressing that brings every garment back to life — looking and feeling new.',
    points: ['Delicate hand wash', 'Steam press & finish', 'Stain treatment included'],
  },
  {
    Icon: Ruler,
    title: 'Custom Fittings',
    desc: 'Made-to-measure adjustments for your most loved pieces. We refine every line so your clothes fit only you.',
    points: ['In-person measurements', 'Multiple fittings if needed', 'Doorstep pickup available'],
  },
  {
    Icon: ShieldCheck,
    title: 'Garment Restoration',
    desc: 'Bring tired threads back to life. Repairs, re-stitching, and quiet restorative care for the pieces you love.',
    points: ['Seam & button repair', 'Lining replacement', 'Vintage care'],
  },
  {
    Icon: Truck,
    title: 'Doorstep Service',
    desc: 'Pickup and delivery across Calicut and beyond. Always on standby — we come to you, your clothes come back better.',
    points: ['7 days a week', 'WhatsApp booking', 'Tracking on every order'],
    feature: true,
  },
];

const process = [
  { step: '01', title: 'Tell us', desc: 'Drop us a message on WhatsApp with what you need.' },
  { step: '02', title: 'We pickup', desc: 'Doorstep collection at a time that works for you.' },
  { step: '03', title: 'We refine', desc: 'Every corner inspected, every detail attended.' },
  { step: '04', title: 'Back to you', desc: 'Delivered home — looking like new, ready to wear.' },
];

const Services = () => (
  <motion.main
    className="page-wrap services"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    {/* ---------- HERO ---------- */}
    <section className="services-hero">
      <div className="services-hero__bg" aria-hidden="true">
        <div className="services-hero__glow" />
      </div>

      <div className="container services-hero__inner">
        <motion.div
          className="services-hero__badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <span className="services-hero__badge-dot" />
          Now serving Calicut & nearby
        </motion.div>

        <motion.h1
          className="services-hero__title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          Care your clothes<br />
          <span className="serif-italic">deserve.</span>
        </motion.h1>

        <motion.p
          className="services-hero__sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          A one-stop atelier for every service your wardrobe needs.
          Alterations, laundry, restoration, doorstep pickup — all under one trusted roof.
        </motion.p>

        <motion.div
          className="services-hero__cta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href={`https://wa.me/91${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi NIORA, I'd like to book a service.")}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn--gold"
          >
            Book on WhatsApp <ArrowRight size={16} />
          </a>
          <Link to="/contact" className="btn btn--ghost">
            Talk to us
          </Link>
        </motion.div>

        {/* Quick info row */}
        <motion.div
          className="services-hero__info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="services-hero__info-item">
            <Clock size={14} strokeWidth={1.6} />
            <span>24h express turnaround</span>
          </div>
          <div className="services-hero__info-divider" />
          <div className="services-hero__info-item">
            <Truck size={14} strokeWidth={1.6} />
            <span>Free doorstep pickup</span>
          </div>
          <div className="services-hero__info-divider" />
          <div className="services-hero__info-item">
            <ShieldCheck size={14} strokeWidth={1.6} />
            <span>Quality assured</span>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ---------- SERVICES GRID ---------- */}
    <section className="section">
      <div className="container">
        <motion.div className="services-head" {...fadeUp}>
          <span className="eyebrow">— What we offer —</span>
          <h2 className="services-head__title">
            Every service your<br />
            <span className="serif-italic">wardrobe</span> needs.
          </h2>
        </motion.div>

        <div className="services-grid">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              className={`service-card ${s.feature ? 'service-card--feature' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="service-card__num">N°{String(i + 1).padStart(2, '0')}</span>
              <div className="service-card__icon">
                <s.Icon size={26} strokeWidth={1.5} />
              </div>
              <h3 className="service-card__title">{s.title}</h3>
              <p className="service-card__desc">{s.desc}</p>
              <ul className="service-card__list">
                {s.points.map((p) => (
                  <li key={p}>
                    <CheckCircle2 size={13} strokeWidth={1.8} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {s.feature && (
                <div className="service-card__ribbon">
                  <span>Always on standby</span>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>

    {/* ---------- PROCESS ---------- */}
    <section className="section process">
      <div className="container">
        <motion.div className="services-head" {...fadeUp}>
          <span className="eyebrow eyebrow--gold">— How it works —</span>
          <h2 className="services-head__title services-head__title--cream">
            Simple, fast,<br />
            <span className="serif-italic">reliable.</span>
          </h2>
        </motion.div>

        <div className="process__grid">
          {process.map((p, i) => (
            <motion.div
              key={p.step}
              className="process__step"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <div className="process__step-num">{p.step}</div>
              <div className="process__step-line" aria-hidden="true" />
              <h4 className="process__step-title">{p.title}</h4>
              <p className="process__step-desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ---------- BOOKING CTA ---------- */}
    <section className="section booking">
      <div className="container booking__inner">
        <motion.div className="booking__panel" {...fadeUp}>
          <div className="booking__copy">
            <span className="eyebrow">— Ready to book? —</span>
            <h2 className="booking__title">
              Tell us what you need.<br />
              <span className="serif-italic">We'll handle the rest.</span>
            </h2>
            <p className="booking__sub">
              Send us a quick message — we'll arrange pickup, share a quote, and have your
              clothes looking new in no time.
            </p>
          </div>
          <div className="booking__actions">
            <a
              href={`https://wa.me/91${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi NIORA, I'd like to book a service.")}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn--gold"
            >
              <Phone size={15} strokeWidth={1.7} />
              WhatsApp Us
            </a>
            <Link to="/contact" className="btn btn--ghost">
              Send a message
            </Link>
            <span className="booking__phone">
              or call <strong>+91 {OWNER_WHATSAPP_NUMBER}</strong>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  </motion.main>
);

export default Services;
