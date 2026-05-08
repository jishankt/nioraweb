import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Sparkles, Scissors, Heart,
  Star, ChevronDown, Truck, ShieldCheck, Zap,
} from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { fetchProducts, OWNER_WHATSAPP_NUMBER } from '../services/api.js';
import nioraMark from '../assets/niora-mark.png';
import nioraWordmark from '../assets/niora-wordmark.png';
import './Home.css';

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  // Page 1 (logo) — fades out as you scroll past it
  const { scrollY } = useScroll();
  const splashOpacity = useTransform(scrollY, [0, 400, 700], [1, 0.6, 0]);
  const splashY = useTransform(scrollY, [0, 700], [0, -120]);
  const splashScale = useTransform(scrollY, [0, 700], [1, 0.9]);

  useEffect(() => {
    fetchProducts({ featured: 1 })
      .then((data) => setFeatured(data.results || data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  // Toggle body class when at top of home page (over the dark splash)
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.7) {
        document.body.classList.add('home-top');
      } else {
        document.body.classList.remove('home-top');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.body.classList.remove('home-top');
    };
  }, []);

  return (
    <motion.main
      className="page-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ============================================================
           PAGE 1 — LOGO SPLASH
         ============================================================ */}
      <motion.section
        className="splash"
        style={{ opacity: splashOpacity, y: splashY, scale: splashScale }}
      >
        <div className="splash__bg" aria-hidden="true">
          <div className="splash__glow splash__glow--1" />
          <div className="splash__glow splash__glow--2" />
          <div className="splash__grain" />
        </div>

        {/* Decorative ornament corners */}
        <div className="splash__corner splash__corner--tl" aria-hidden="true">
          <span>EST · MMXXVI</span>
        </div>
        <div className="splash__corner splash__corner--tr" aria-hidden="true">
          <span>CALICUT · INDIA</span>
        </div>
        <div className="splash__corner splash__corner--bl" aria-hidden="true">
          <span>N°01</span>
        </div>
        <div className="splash__corner splash__corner--br" aria-hidden="true">
          <span>✦ ATELIER ✦</span>
        </div>

        <div className="splash__inner">
          {/* The N monogram from uploaded logo, with concentric gold rings */}
          <motion.div
            className="splash__monogram-wrap"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="splash__ring splash__ring--1" aria-hidden="true" />
            <span className="splash__ring splash__ring--2" aria-hidden="true" />
            <span className="splash__ring splash__ring--3" aria-hidden="true" />
            <img src={nioraMark} alt="" className="splash__monogram-img" />
          </motion.div>

          {/* NIORA wordmark from uploaded logo */}
          <motion.div
            className="splash__wordmark"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={nioraWordmark} alt="NIORA" className="splash__wordmark-img" />
          </motion.div>

          {/* Hairline rule */}
          <motion.div
            className="splash__rule"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Tagline below */}
          <motion.span
            className="splash__tagline"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.7 }}
          >
            Detailing your outfits.
          </motion.span>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="splash__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          <span>Scroll to discover</span>
          <ChevronDown size={18} strokeWidth={1.5} />
        </motion.div>
      </motion.section>

      {/* ============================================================
           PAGE 2 — HERO (the previous "first page" content)
         ============================================================ */}
      <section className="hero">
        <div className="hero__atmosphere" aria-hidden="true">
          <div className="hero__noise" />
          <div className="hero__glow hero__glow--1" />
          <div className="hero__glow hero__glow--2" />
        </div>

        <div className="hero__rule hero__rule--left" aria-hidden="true">
          <span>EST · MMXXVI</span>
        </div>
        <div className="hero__rule hero__rule--right" aria-hidden="true">
          <span>KOCHI · INDIA</span>
        </div>

        <div className="container hero__inner">
          <motion.div
            className="hero__eyebrow"
            {...fadeUp}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 28 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="hero__ornament">✦</span>
            <span>The Atelier of Care</span>
            <span className="hero__ornament">✦</span>
          </motion.div>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="hero__title-line">Luxurious</span>
            <span className="hero__title-line hero__title-italic"><em>and</em></span>
            <span className="hero__title-line">Contemporary</span>
            <span className="hero__title-line hero__title-flourish">
              <span className="hero__title-rule" aria-hidden="true" />
              <em>for</em>
              <span className="hero__title-emphasis">Every Wardrobe</span>
            </span>
          </motion.h1>

          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A one-stop atelier for everything your wardrobe needs —
            expert alterations, premium laundry, and doorstep service from Calicut.
          </motion.p>

          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            <Link to="/services" className="btn btn--gold">
              Explore Services <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn btn--ghost">
              Why NIORA
            </Link>
          </motion.div>

          <motion.div
            className="hero__credits"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="hero__credit">
              <span className="hero__credit-num">N°01</span>
              <span className="hero__credit-label">The Edit</span>
            </div>
            <div className="hero__credit-divider" />
            <div className="hero__credit">
              <span className="hero__credit-num">SS<span className="hero__credit-num-sep">·</span>26</span>
              <span className="hero__credit-label">Spring / Summer</span>
            </div>
            <div className="hero__credit-divider" />
            <div className="hero__credit">
              <span className="hero__credit-num hero__credit-num--symbol">∞</span>
              <span className="hero__credit-label">Made for you</span>
            </div>
          </motion.div>
        </div>

        {/* Hero gallery strip */}
        <motion.div
          className="hero__gallery"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          {[
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
            'https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&q=80',
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
            'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80',
          ].map((src, i) => (
            <motion.div
              key={src}
              className={`hero__gallery-item hero__gallery-item--${i}`}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.7 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.classList.add('hero__gallery-item--fallback');
                }}
              />
              <div className="hero__gallery-overlay" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============================================================
           PAGE 3 — "DETAILING YOUR OUTFITS" full-screen statement
         ============================================================ */}
      <section className="statement statement--detailing">
        <div className="statement__bg" aria-hidden="true">
          <div className="statement__pattern" />
          <div className="statement__glow" />
          <div className="statement__grain" />
        </div>

        {/* Floating gold ornaments */}
        <motion.span
          className="statement__ornament statement__ornament--1"
          aria-hidden="true"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          ✦
        </motion.span>
        <motion.span
          className="statement__ornament statement__ornament--2"
          aria-hidden="true"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        >
          ❋
        </motion.span>

        <div className="container statement__inner">
          <motion.span
            className="statement__eyebrow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="statement__eyebrow-line" />
            <span>Our Promise</span>
            <span className="statement__eyebrow-line" />
          </motion.span>

          <motion.h2
            className="statement__title"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="statement__title-word statement__title-word--1">Detailing</span>
            <span className="statement__title-word statement__title-word--2">
              <em>your</em>
            </span>
            <span className="statement__title-word statement__title-word--3">outfits.</span>
          </motion.h2>

          <motion.p
            className="statement__sub"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            From the perfect fit to a flawless finish.
          </motion.p>

          {/* Decorative bottom flourish */}
          <motion.div
            className="statement__flourish"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="statement__flourish-line" />
            <span className="statement__flourish-dot">✦</span>
            <span className="statement__flourish-line" />
          </motion.div>
        </div>
      </section>

      {/* ============================================================
           PAGE 4 — "Make every outfit stand out" detail message
         ============================================================ */}
      <section className="manifesto">
        <div className="manifesto__bg" aria-hidden="true">
          <div className="manifesto__glow manifesto__glow--1" />
          <div className="manifesto__glow manifesto__glow--2" />
          <div className="manifesto__grain" />
        </div>

        <div className="container manifesto__inner">
          <motion.span
            className="eyebrow eyebrow--gold"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="manifesto__eyebrow-mark">✦</span> The NIORA way
          </motion.span>

          <motion.h2
            className="manifesto__headline"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            We make <span className="manifesto__highlight">every outfit</span><br />
            <em>stand out</em> with creative<br />
            <span className="manifesto__highlight">detailing.</span>
          </motion.h2>

          {/* The two pillar lines */}
          <div className="manifesto__pillars">
            <motion.div
              className="manifesto__pillar"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <div className="manifesto__pillar-icon">
                <Scissors size={22} strokeWidth={1.5} />
              </div>
              <div className="manifesto__pillar-line" />
              <h3 className="manifesto__pillar-title">
                Refine <em>every</em> stitch.
              </h3>
              <p className="manifesto__pillar-desc">
                Hand-finished alterations and tailoring done with the patience your favourite
                pieces deserve. Hems that hang true. Seams that disappear. Fits that flatter.
              </p>
            </motion.div>

            <motion.div
              className="manifesto__pillar-divider"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              aria-hidden="true"
            />

            <motion.div
              className="manifesto__pillar"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              <div className="manifesto__pillar-icon">
                <Sparkles size={22} strokeWidth={1.5} />
              </div>
              <div className="manifesto__pillar-line" />
              <h3 className="manifesto__pillar-title">
                Refresh <em>every</em> thread.
              </h3>
              <p className="manifesto__pillar-desc">
                Premium laundry, gentle wash, and finish-press that bring every garment back
                to life — looking, feeling, and falling like new from the very first wear.
              </p>
            </motion.div>
          </div>

          {/* Bottom feature row */}
          <motion.div
            className="manifesto__features"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.6 }}
          >
            <div className="manifesto__feature">
              <ShieldCheck size={16} strokeWidth={1.6} />
              <span>Every corner inspected</span>
            </div>
            <div className="manifesto__feature">
              <Zap size={16} strokeWidth={1.6} />
              <span>Faster · More reliable</span>
            </div>
            <div className="manifesto__feature">
              <Truck size={16} strokeWidth={1.6} />
              <span>Doorstep service</span>
            </div>
          </motion.div>

          <motion.div
            className="manifesto__cta"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.8 }}
          >
            <Link to="/services" className="btn btn--gold">
              See How We Work <ArrowRight size={16} />
            </Link>
            <a
              href={`https://wa.me/91${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi NIORA, I'd like to book a service.")}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn--ghost btn--ghost-cream"
            >
              Book on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
           MARQUEE
         ============================================================ */}
      <div className="marquee">
        <div className="marquee__track">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="marquee__group" key={i}>
              <span>Detailing Your Outfits</span>
              <span aria-hidden>✦</span>
              <span>Alterations · Laundry · Restoration</span>
              <span aria-hidden>✦</span>
              <span>Doorstep Pickup · Calicut</span>
              <span aria-hidden>✦</span>
              <span>Quality Assured · Always</span>
              <span aria-hidden>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
           FEATURED PRODUCTS
         ============================================================ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              — Curated Selection —
            </motion.span>
            <motion.h2
              className="section-head__title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              The <span className="serif-italic">edit</span>
            </motion.h2>
            <motion.p
              className="section-head__sub"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              A handpicked rotation — pieces with story, in fabrics that drape and behave the way you want them to.
            </motion.p>
          </div>

          <div className="grid grid--products">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card">
                    <div className="shimmer" style={{ aspectRatio: '3/4' }} />
                    <div className="shimmer" style={{ height: 16, marginTop: 16, width: '40%' }} />
                    <div className="shimmer" style={{ height: 22, marginTop: 8, width: '70%' }} />
                  </div>
                ))
              : featured.slice(0, 4).map((p, i) => (
                  <ProductCard product={p} index={i} key={p.id} />
                ))}
          </div>

          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link to="/collection" className="btn btn--ghost">
              View Full Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
           QUOTE BAND
         ============================================================ */}
      <section className="quote-band">
        <div className="container">
          <motion.div
            className="quote"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="quote__stars" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="quote__text">
              <span className="quote__mark" aria-hidden="true">"</span>
              The dress arrived and I forgot I was wearing it — which is, I think,
              the highest compliment a piece of clothing can earn.
              <span className="quote__mark quote__mark--end" aria-hidden="true">"</span>
            </blockquote>
            <cite className="quote__author">
              — <span className="serif-italic">Aishwarya R.</span>, Bengaluru
            </cite>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
           SERVICES TEASER (book CTA)
         ============================================================ */}
      <section className="section services-teaser">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="eyebrow eyebrow--cream">— Book a service —</span>
            <h2 className="services-teaser__title">
              Doorstep service,<br />
              <span className="serif-italic">always on standby.</span>
            </h2>
            <p className="services-teaser__copy">
              Alterations, laundry, restoration — every service your wardrobe needs,
              delivered to your door across Calicut. Quality assured, faster than you'd expect.
            </p>
            <Link to="/services" className="btn btn--gold">
              See All Services <ArrowRight size={16} />
            </Link>

            <div className="services-teaser__loop" aria-hidden="true">
              {Array.from({ length: 2 }).map((_, i) => (
                <span key={i}>
                  Alterations · Laundry · Restoration · Custom Fittings · Doorstep Service ·
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
};

export default Home;
