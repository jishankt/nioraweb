import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { fetchProducts, fetchCategories } from '../services/api.js';
import './Collection.css';

const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState(searchParams.get('ordering') || '-created_at');

  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.results || data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (search) params.search = search;
    if (sort) params.ordering = sort;

    fetchProducts(params)
      .then((data) => setProducts(data.results || data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory, search, sort]);

  const setCategory = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    setSearchParams(params);
  };

  return (
    <motion.main
      className="page-wrap collection-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="collection-hero">
        <div className="container">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            — The Edit —
          </motion.span>
          <motion.h1
            className="collection-hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Our <span className="serif-italic">Collection</span>
          </motion.h1>
          <motion.p
            className="collection-hero__sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            {products.length} {products.length === 1 ? 'piece' : 'pieces'}
            {activeCategory ? ` in ${activeCategory}` : ', curated for you'}
          </motion.p>
        </div>
      </header>

      <section className="container">
        <div className="collection-bar">
          <div className="collection-cats hide-mobile">
            <button
              className={`collection-cat ${!activeCategory ? 'is-active' : ''}`}
              onClick={() => setCategory('')}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                className={`collection-cat ${activeCategory === c.slug ? 'is-active' : ''}`}
                onClick={() => setCategory(c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="collection-tools">
            <input
              type="search"
              placeholder="Search…"
              className="collection-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="collection-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="-created_at">Newest</option>
              <option value="price">Price: Low → High</option>
              <option value="-price">Price: High → Low</option>
              <option value="name">Name: A → Z</option>
            </select>
            <button
              className="collection-filter-btn hide-desktop"
              onClick={() => setShowFilters(true)}
              aria-label="Filters"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="collection-mobile-filters">
            <div className="collection-mobile-filters__inner">
              <div className="flex justify-between items-center" style={{ marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--niora-emerald)' }}>Filters</h3>
                <button onClick={() => setShowFilters(false)}><X size={22} /></button>
              </div>
              <button
                className={`collection-cat ${!activeCategory ? 'is-active' : ''}`}
                onClick={() => { setCategory(''); setShowFilters(false); }}
              >All</button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  className={`collection-cat ${activeCategory === c.slug ? 'is-active' : ''}`}
                  onClick={() => { setCategory(c.slug); setShowFilters(false); }}
                >{c.name}</button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid--products" style={{ marginTop: '2.5rem' }}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card">
                  <div className="shimmer" style={{ aspectRatio: '3/4' }} />
                  <div className="shimmer" style={{ height: 16, marginTop: 16, width: '40%' }} />
                  <div className="shimmer" style={{ height: 22, marginTop: 8, width: '70%' }} />
                </div>
              ))
            : products.length === 0
            ? (
              <div className="collection-empty">
                <p className="serif-italic" style={{ fontSize: '1.6rem', color: 'var(--niora-emerald)' }}>
                  Nothing here yet.
                </p>
                <p style={{ color: 'rgba(15,58,50,0.6)' }}>
                  Try a different category or search term.
                </p>
              </div>
            )
            : products.map((p, i) => <ProductCard product={p} index={i} key={p.id} />)}
        </div>
      </section>
    </motion.main>
  );
};

export default Collection;
