import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Heart } from 'lucide-react';

const Shop = ({ products, addToCart, cart, wishlist, toggleWishlist }) => {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', ...new Set(products.map(p => p.category))];

    const filteredProducts = products.filter(product => {
        const matchesCategory = filter === 'All' || product.category === filter;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="shop section-padding">
            <div className="container">
                <div className="flex justify-between items-center" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1>Shop All Products</h1>
                    <div className="flex gap-4 items-center">
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '0.5rem 1rem 0.5rem 2.5rem',
                                    borderRadius: '20px',
                                    border: '1px solid #ddd',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div className="flex gap-2 overflow-auto pb-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`btn ${filter === cat ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setFilter(cat)}
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card animate-fade-in" style={{
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'transform 0.3s',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                        }}>
                            <button
                                onClick={() => toggleWishlist(product)}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'var(--shadow-sm)',
                                    zIndex: 10,
                                    color: wishlist.some(item => item.id === product.id) ? '#e91e63' : '#ccc'
                                }}
                            >
                                <Heart size={18} fill={wishlist.some(item => item.id === product.id) ? '#e91e63' : 'none'} />
                            </button>

                            <Link to={`/product/${product.id}`} style={{ height: '300px', overflow: 'hidden', display: 'block' }}>
                                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                            </Link>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>{product.category}</p>
                                <Link to={`/product/${product.id}`}>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                                </Link>
                                <div className="flex justify-between items-center" style={{ marginTop: 'auto' }}>
                                    <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{product.price}</p>
                                    <div className="flex items-center gap-2">
                                        {cart.find(item => item.id === product.id) && (
                                            <span style={{
                                                fontSize: '0.8rem',
                                                backgroundColor: '#e8f5e9',
                                                color: '#2e7d32',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '12px',
                                                fontWeight: '500'
                                            }}>
                                                {cart.find(item => item.id === product.id).quantity} in cart
                                            </span>
                                        )}
                                        <button
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                                addToCart(product);
                                                const btn = e.currentTarget;
                                                btn.classList.add('animate-shake');
                                                setTimeout(() => btn.classList.remove('animate-shake'), 400);
                                            }}
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Shop;
