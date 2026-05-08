import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, Zap, Sparkles, Truck,
  CheckCircle2, MapPin, Scissors,
} from 'lucide-react';
import nioraMark from '../assets/niora-mark.png';
import './About.css';

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
};

const reasons = [
  {
    Icon: Sparkles,
    title: 'One-stop solution',
    desc: 'Every service your wardrobe needs — alterations, laundry, restoration, finishing — all under one roof.',
  },
  {
    Icon: Shield,
    title: 'Quality, assured',
    desc: 'Every piece is inspected with care. We treat your clothes the way we treat our own.',
  },
  {
    Icon: Zap,
    title: 'Faster, more reliable',
    desc: 'Quick turnaround without compromise. Your clothes back to you when promised.',
  },
  {
    Icon: CheckCircle2,
    title: 'Every corner checked',
    desc: 'We meticulously inspect every seam, hem, and thread — and return your outfit looking as good as new.',
  },
  {
    Icon: Truck,
    title: 'Doorstep service',
    desc: 'Always on standby. Pickup and delivery at your convenience — across Calicut and beyond.',
  },
];

const About = () => (
  <motion.main
    className="page-wrap about"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    {/* ---------- HERO ---------- */}
    <section className="about-hero">
      {/* Decorative background */}
      <div className="about-hero__bg" aria-hidden="true">
        <div className="about-hero__glow about-hero__glow--1" />
        <div className="about-hero__glow about-hero__glow--2" />
      </div>

      <div className="container about-hero__inner">
        <motion.div
          className="about-hero__monogram-wrap"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="about-hero__monogram-ring" aria-hidden="true" />
          <span className="about-hero__monogram-ring about-hero__monogram-ring--2" aria-hidden="true" />
          <div className="about-hero__monogram-disc">
            <img src={nioraMark} alt="" className="about-hero__monogram-img" />
          </div>
        </motion.div>

        <motion.span
          className="eyebrow about-hero__eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <span className="about-hero__eyebrow-dot" /> Calicut · India · Est. MMXXVI
        </motion.span>

        <motion.h1
          className="about-hero__title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
        >
          We refine your style,<br />
          <span className="serif-italic">thread</span> by <span className="serif-italic">thread.</span>
        </motion.h1>

        <motion.p
          className="about-hero__lede"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          NIORA is a fashion service startup based in <strong>Calicut, India</strong>. We provide expert
          care for everything in your wardrobe — meticulous alterations and premium laundry services that
          breathe new life into every thread. From the perfect fit to a flawless finish,
          we refine your style so you can wear your clothes with renewed confidence.
        </motion.p>

        <motion.div
          className="about-hero__cta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Link to="/services" className="btn btn--primary">
            Our Services <ArrowRight size={16} />
          </Link>
          <Link to="/contact" className="btn btn--ghost">
            Book a Pickup
          </Link>
        </motion.div>
      </div>
    </section>

    {/* ---------- INTRODUCTION / PHILOSOPHY ---------- */}
    <section className="section about-intro">
      <div className="container about-intro__grid">
        <motion.div
          className="about-intro__media"
          {...fadeUp}
          transition={{ duration: 0.9 }}
        >
          <img
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80"
            alt="Tailoring detail"
          />
          <div className="about-intro__plaque" aria-hidden="true">
            <span className="about-intro__plaque-num">01</span>
            <div className="about-intro__plaque-line" />
            <span className="about-intro__plaque-text">
              Detailing<br />your outfits
            </span>
          </div>
        </motion.div>

        <motion.div
          className="about-intro__copy"
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          <span className="eyebrow">— Who we are —</span>
          <h2 className="about-intro__title">
            A new kind of <span className="serif-italic">atelier</span>,<br />
            built around your <span className="serif-italic">wardrobe.</span>
          </h2>
          <p>
            We meticulously check every corner of your clothing, providing expert alterations
            and premium laundry services that breathe new life into every thread.
          </p>
          <p>
            From the perfect fit to a flawless finish, we refine your style so you can wear
            your clothes with renewed confidence. Whether it's a trusted favourite that
            needs a second life, a wedding garment that needs to fit just right, or your
            everyday wardrobe that deserves better care — NIORA is the team you call.
          </p>

          <div className="about-intro__signature">
            <div className="about-intro__signature-line" />
            <div>
              <span className="about-intro__signature-text">Detailing your outfits.</span>
              <span className="about-intro__signature-loc">
                <MapPin size={12} strokeWidth={1.6} /> Calicut, Kerala
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ---------- WHY NIORA ---------- */}
    <section className="section why">
      <div className="why__bg" aria-hidden="true">
        <div className="why__grain" />
      </div>
      <div className="container">
        <motion.div className="why__head" {...fadeUp} transition={{ duration: 0.8 }}>
          <span className="eyebrow eyebrow--gold">— The NIORA Difference —</span>
          <h2 className="why__title">
            Why NIORA <span className="why__title-mark">is</span><br />
            <span className="serif-italic why__title-italic">simply better.</span>
          </h2>
          <p className="why__sub">
            Five reasons your wardrobe will thank you.
          </p>
        </motion.div>

        <div className="why__grid">
          {reasons.map((r, i) => (
            <motion.article
              key={r.title}
              className="why__card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="why__card-num">N°{String(i + 1).padStart(2, '0')}</span>
              <div className="why__card-icon">
                <r.Icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="why__card-title">{r.title}</h3>
              <p className="why__card-desc">{r.desc}</p>
              <div className="why__card-shine" aria-hidden="true" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>

    {/* ---------- VALUES STRIP ---------- */}
    <section className="values">
      <div className="container values__inner">
        <motion.div className="values__item" {...fadeUp}>
          <span className="values__num">100%</span>
          <span className="values__label">Care, assured</span>
        </motion.div>
        <div className="values__divider" />
        <motion.div className="values__item" {...fadeUp} transition={{ delay: 0.1 }}>
          <span className="values__num">24h</span>
          <span className="values__label">Express turnaround</span>
        </motion.div>
        <div className="values__divider" />
        <motion.div className="values__item" {...fadeUp} transition={{ delay: 0.2 }}>
          <span className="values__num">∞</span>
          <span className="values__label">Threads cared for</span>
        </motion.div>
        <div className="values__divider" />
        <motion.div className="values__item" {...fadeUp} transition={{ delay: 0.3 }}>
          <span className="values__num">7 days</span>
          <span className="values__label">Doorstep service</span>
        </motion.div>
      </div>
    </section>

    {/* ---------- CTA ---------- */}
    <section className="section about-cta">
      <div className="container text-center">
        <motion.div {...fadeUp} transition={{ duration: 0.9 }}>
          <span className="eyebrow eyebrow--cream">— Ready when you are —</span>
          <h2 className="about-cta__title">
            Let's give your wardrobe<br />
            <span className="serif-italic">the care it deserves.</span>
          </h2>
          <div className="about-cta__buttons">
            <Link to="/services" className="btn btn--gold">
              Explore Services <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn--ghost btn--ghost-cream">
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </motion.main>
);

export default About;
