import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = ({ products }) => {
    const featuredProducts = products.slice(0, 3);

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero" style={{
                height: '80vh',
                backgroundColor: 'var(--color-surface)',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '2rem' }}>
                    <div className="animate-fade-in">
                        <span style={{
                            color: 'var(--color-primary)',
                            fontWeight: '600',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                            display: 'block'
                        }}>New Collection</span>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
                            Discover Your <br />
                            <span style={{ color: 'var(--color-secondary-light)', textShadow: '1px 1px 0 var(--color-primary)' }}>True Radiance</span>
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: '2rem', maxWidth: '500px' }}>
                            Explore our exclusive collection of handcrafted jewelry and premium cosmetics designed to enhance your natural beauty.
                        </p>
                        <Link to="/shop" className="btn btn-primary">
                            Shop Now <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                        </Link>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'var(--color-accent)',
                            borderRadius: '50% 50% 0 0',
                            zIndex: 0
                        }}></div>
                        <img
                            src="https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800"
                            alt="Hero Model"
                            style={{
                                position: 'relative',
                                zIndex: 1,
                                borderRadius: '50% 50% 0 0',
                                boxShadow: 'var(--shadow-xl)',
                                width: '100%',
                                maxWidth: '500px',
                                height: 'auto'
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section-padding">
                <div className="container">
                    <h2 className="text-center" style={{ marginBottom: '3rem' }}>Shop by Category</h2>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        {['Jewelry', 'Cosmetics', 'Accessories'].map((cat, index) => (
                            <div key={index} style={{
                                position: 'relative',
                                height: '300px',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }}>
                                <img
                                    src={
                                        cat === 'Jewelry' ? 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600' :
                                            cat === 'Cosmetics' ? 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=600' :
                                                'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=600'
                                    }
                                    alt={cat}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    padding: '2rem',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                    color: 'white'
                                }}>
                                    <h3>{cat}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
                <div className="container">
                    <div className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
                        <h2>Trending Now</h2>
                        <Link to="/shop" className="btn btn-outline">View All</Link>
                    </div>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {featuredProducts.map(product => (
                            <Link to={`/product/${product.id}`} key={product.id} style={{
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'transform 0.3s'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ height: '300px', overflow: 'hidden' }}>
                                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>{product.category}</p>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                                    <p style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>₹{product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
