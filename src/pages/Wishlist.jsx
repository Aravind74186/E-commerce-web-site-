import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';

const Wishlist = ({ wishlist, toggleWishlist, addToCart }) => {
    if (wishlist.length === 0) {
        return (
            <div className="container section-padding text-center">
                <div style={{
                    width: '80px', height: '80px', backgroundColor: '#ffebee', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                    color: '#c62828'
                }}>
                    <Heart size={40} />
                </div>
                <h2 style={{ marginBottom: '1rem' }}>Your Wishlist is Empty</h2>
                <p style={{ marginBottom: '2rem' }}>Save items you love to buy later.</p>
                <Link to="/shop" className="btn btn-primary">Explore Products</Link>
            </div>
        );
    }

    return (
        <div className="wishlist section-padding">
            <div className="container">
                <h1 style={{ marginBottom: '2rem' }}>My Wishlist ({wishlist.length})</h1>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {wishlist.map(product => (
                        <div key={product.id} style={{
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-sm)',
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
                                    color: '#e91e63'
                                }}
                            >
                                <Trash2 size={18} />
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
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => addToCart(product)}
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                    >
                                        <ShoppingBag size={16} style={{ marginRight: '0.5rem' }} /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
