import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/collection', label: 'Collection' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { totalQuantity, openCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__row">
        {/* Typographic wordmark — text only */}
        <Link to="/" className="nav__brand" aria-label="NIORA home">
          <span className="nav__brand-text">NIORA</span>
          <span className="nav__brand-tag" aria-hidden="true">Atelier</span>
        </Link>

        <nav className="nav__links hide-mobile">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `nav__link ${isActive ? 'nav__link--active' : ''}`
              }
            >
              <span className="nav__link-text">{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <button
            className="nav__cart"
            onClick={openCart}
            aria-label={`Cart with ${totalQuantity} items`}
          >
            <ShoppingBag size={17} strokeWidth={1.5} />
            <AnimatePresence>
              {totalQuantity > 0 && (
                <motion.span
                  className="nav__cart-badge"
                  key={totalQuantity}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                  {totalQuantity}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            className="nav__menu-btn hide-desktop"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {links.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `nav__mobile-link ${isActive ? 'nav__mobile-link--active' : ''}`
                  }
                >
                  {l.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
