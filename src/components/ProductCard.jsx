import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import nioraMark from '../assets/niora-mark.png';
import './ProductCard.css';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

const ProductCard = ({ product, index = 0 }) => {
  const { addItem } = useCart();
  const [imageOk, setImageOk] = useState(true);
  const price = product.discount_price || product.price;
  const hasDiscount = !!product.discount_price;
  const image = product.image || product.image_url;
  const showImage = image && imageOk;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const sizes = (product.sizes || '').split(',').map(s => s.trim()).filter(Boolean);
    const colors = (product.colors || '').split(',').map(s => s.trim()).filter(Boolean);
    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(price),
      image,
      size: sizes[0] || '',
      color: colors[0] || '',
      quantity: 1,
    });
  };

  return (
    <motion.article
      className="card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product.slug}`} className="card__link">
        <div className="card__image-wrap">
          {showImage ? (
            <img
              src={image}
              alt={product.name}
              className="card__image"
              loading="lazy"
              onError={() => setImageOk(false)}
            />
          ) : (
            <div className="card__placeholder" aria-hidden="true">
              <img src={nioraMark} alt="" className="card__placeholder-mark" />
              <span className="card__placeholder-label">NIORA</span>
              <span className="card__placeholder-tag">Detailing your outfits</span>
            </div>
          )}

          {hasDiscount && <span className="card__badge">Sale</span>}
          {!product.in_stock && <span className="card__badge card__badge--soft">Sold out</span>}

          <button
            className="card__quick-add"
            onClick={handleQuickAdd}
            disabled={!product.in_stock}
            aria-label={`Quick add ${product.name}`}
          >
            <Plus size={16} strokeWidth={1.7} />
            <span>Quick Add</span>
          </button>
        </div>

        <div className="card__body">
          <span className="card__category">{product.category_name || '—'}</span>
          <h3 className="card__name">{product.name}</h3>
          <div className="card__price-row">
            <span className="card__price">{formatINR(price)}</span>
            {hasDiscount && (
              <span className="card__price--strike">{formatINR(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductCard;
