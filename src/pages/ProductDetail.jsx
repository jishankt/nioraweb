import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, ShoppingBag, Heart, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { fetchProduct, fetchProducts } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import './ProductDetail.css';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n);

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem, openCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProduct(slug)
      .then((p) => {
        setProduct(p);
        const sizes = (p.sizes || '').split(',').map((s) => s.trim()).filter(Boolean);
        const colors = (p.colors || '').split(',').map((s) => s.trim()).filter(Boolean);
        if (sizes[0]) setSize(sizes[0]);
        if (colors[0]) setColor(colors[0]);
        // related
        return fetchProducts({ category: p.category });
      })
      .then((data) => {
        const list = data.results || data || [];
        setRelated(list.filter((x) => x.slug !== slug).slice(0, 4));
      })
      .catch(() => setError('Could not load this product.'))
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <main className="page-wrap pdp" style={{ paddingTop: '8rem' }}>
        <div className="container pdp__grid">
          <div className="shimmer" style={{ aspectRatio: '4/5' }} />
          <div>
            <div className="shimmer" style={{ height: 18, width: '30%' }} />
            <div className="shimmer" style={{ height: 44, width: '80%', marginTop: 18 }} />
            <div className="shimmer" style={{ height: 22, width: '40%', marginTop: 22 }} />
            <div className="shimmer" style={{ height: 100, width: '100%', marginTop: 22 }} />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="page-wrap" style={{ paddingTop: '10rem', textAlign: 'center' }}>
        <div className="container">
          <p className="serif-italic" style={{ fontSize: '1.6rem', color: 'var(--niora-emerald)' }}>
            {error || 'Product not found.'}
          </p>
          <Link to="/collection" className="btn btn--primary" style={{ marginTop: '1.4rem' }}>
            Back to Collection
          </Link>
        </div>
      </main>
    );
  }

  const sizes = (product.sizes || '').split(',').map((s) => s.trim()).filter(Boolean);
  const colors = (product.colors || '').split(',').map((s) => s.trim()).filter(Boolean);
  const price = product.discount_price || product.price;
  const hasDiscount = !!product.discount_price;
  const image = product.image || product.image_url;

  const handleAdd = () => {
    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(price),
      image,
      size,
      color,
      quantity: qty,
    });
  };

  const handleBuyNow = () => {
    handleAdd();
    setTimeout(openCart, 300);
  };

  return (
    <motion.main
      className="page-wrap pdp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container">
        <Link to="/collection" className="pdp__back">
          <ArrowLeft size={16} /> Back to Collection
        </Link>

        <div className="pdp__grid">
          <motion.div
            className="pdp__media"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {image ? (
              <img src={image} alt={product.name} />
            ) : (
              <div className="pdp__media--placeholder" />
            )}
            {hasDiscount && <span className="pdp__badge">Sale</span>}
          </motion.div>

          <motion.div
            className="pdp__details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="eyebrow">{product.category_name || 'Niora'}</span>
            <h1 className="pdp__title">{product.name}</h1>

            <div className="pdp__price-row">
              <span className="pdp__price">{formatINR(price)}</span>
              {hasDiscount && <span className="pdp__price-strike">{formatINR(product.price)}</span>}
              {!product.in_stock && <span className="pdp__stock-tag">Sold out</span>}
              {product.in_stock && product.stock_quantity < 5 && (
                <span className="pdp__stock-tag pdp__stock-tag--warm">
                  Only {product.stock_quantity} left
                </span>
              )}
            </div>

            <p className="pdp__description">
              {product.description || 'A beautifully made piece — selected for its drape, fit, and finish.'}
            </p>

            {colors.length > 0 && (
              <div className="pdp__option">
                <label>Color: <span>{color}</span></label>
                <div className="pdp__color-list">
                  {colors.map((c) => (
                    <button
                      key={c}
                      className={`pdp__color ${color === c ? 'is-active' : ''}`}
                      onClick={() => setColor(c)}
                      title={c}
                      type="button"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="pdp__option">
                <label>Size: <span>{size}</span></label>
                <div className="pdp__size-list">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      className={`pdp__size ${size === s ? 'is-active' : ''}`}
                      onClick={() => setSize(s)}
                      type="button"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pdp__option">
              <label>Quantity</label>
              <div className="pdp__qty-row">
                <div className="qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="decrease">
                    <Minus size={14} />
                  </button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} aria-label="increase">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="pdp__cta">
              <button
                className="btn btn--primary btn--block"
                onClick={handleAdd}
                disabled={!product.in_stock}
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
              <button
                className="btn btn--ghost btn--block"
                onClick={handleBuyNow}
                disabled={!product.in_stock}
              >
                Buy Now <Heart size={16} />
              </button>
            </div>

            <ul className="pdp__perks">
              <li><Truck size={15} strokeWidth={1.5} /> Direct WhatsApp confirmation</li>
              <li><Shield size={15} strokeWidth={1.5} /> Quality assured by NIORA</li>
              <li><RefreshCw size={15} strokeWidth={1.5} /> Easy returns within 7 days</li>
            </ul>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="pdp__related">
            <div className="section-head">
              <span className="eyebrow">— You may also like —</span>
              <h2 className="section-head__title">More <span className="serif-italic">to explore</span></h2>
            </div>
            <div className="grid grid--products">
              {related.map((p, i) => <ProductCard product={p} index={i} key={p.id} />)}
            </div>
          </section>
        )}
      </div>
    </motion.main>
  );
};

export default ProductDetail;
