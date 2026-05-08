import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { OWNER_WHATSAPP_NUMBER } from '../services/api.js';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Decorative top divider */}
      <div className="footer__decor" aria-hidden="true">
        <svg width="100%" height="40" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0,20 Q300,0 600,20 T1200,20" stroke="rgba(243,223,180,0.3)" strokeWidth="1" fill="none" />
          <path d="M0,20 Q300,40 600,20 T1200,20" stroke="rgba(243,223,180,0.15)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="container footer__inner">
        {/* Brand — typographic wordmark only */}
        <div className="footer__brand">
          <Link to="/" className="footer__wordmark" aria-label="NIORA home">
            <span className="footer__wordmark-text">NIORA</span>
            <span className="footer__wordmark-dot" aria-hidden="true">✦</span>
          </Link>
          <p className="footer__tagline">
            <span className="serif-italic">Detailing</span> your outfits.
          </p>
          <p className="footer__copy">
            A fashion service startup from Calicut. Expert alterations, premium laundry,
            and doorstep care for every thread in your wardrobe.
          </p>

          <div className="footer__social">
            <a href="https://instagram.com/niora_oficial" aria-label="Instagram" className="footer__social-link">
              <Instagram size={15} strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="Facebook" className="footer__social-link">
              <Facebook size={15} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h5 className="footer__heading">Shop</h5>
          <Link to="/collection" className="footer__link footer__link--feature">
            <span>Collection</span>
            <ArrowUpRight size={12} strokeWidth={1.6} />
          </Link>
          <Link to="/collection?category=dresses" className="footer__link">Dresses</Link>
          <Link to="/collection?category=tops" className="footer__link">Tops</Link>
          <Link to="/collection?category=outerwear" className="footer__link">Outerwear</Link>
          <Link to="/collection?category=accessories" className="footer__link">Accessories</Link>
        </div>

        <div className="footer__col">
          <h5 className="footer__heading">Atelier</h5>
          <Link to="/about" className="footer__link">About</Link>
          <Link to="/services" className="footer__link">Services</Link>
          <Link to="/contact" className="footer__link">Contact</Link>
        </div>

        <div className="footer__col">
          <h5 className="footer__heading">Reach Us</h5>
          <a
            href={`https://wa.me/91${OWNER_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="footer__contact"
          >
            <Phone size={14} strokeWidth={1.6} />
            <span>+91 {OWNER_WHATSAPP_NUMBER}</span>
          </a>
          <a href="mailto:hello@niora.shop" className="footer__contact">
            <Mail size={14} strokeWidth={1.6} />
            <span> hellonioraofficial@gmail.com</span>
          </a>
          <div className="footer__newsletter">
            <span className="footer__newsletter-label">— Now serving —</span>
            <span className="footer__newsletter-text">Calicut · Kerala · India</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <span>© {year} NIORA — All rights reserved.</span>
        <span className="footer__credit">
          <span className="serif-italic">Detailing your outfits, with care.</span>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
