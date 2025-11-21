import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, Search, User, Heart } from 'lucide-react';

const Navbar = ({ cartCount, wishlistCount, user, onLogout }) => {
    return (
        <nav className="navbar" style={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            zIndex: 1000,
            padding: '1rem 0'
        }}>
            <div className="container flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button className="mobile-menu" style={{ display: 'none' }}>
                        <Menu size={24} />
                    </button>
                    <Link to="/" className="logo" style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: 'var(--color-primary)',
                        letterSpacing: '-0.02em'
                    }}>
                        Kavs Glamstone
                    </Link>
                </div>

                <div className="nav-links flex gap-8" style={{ fontWeight: 500 }}>
                    <Link to="/">Home</Link>
                    <Link to="/shop">Shop</Link>
                    {user && user.role === 'manager' && <Link to="/inventory">Inventory</Link>}
                </div>

                <div className="nav-icons flex items-center gap-4">
                    <button><Search size={20} /></button>

                    <Link to="/wishlist" style={{ position: 'relative' }}>
                        <Heart size={20} />
                        {wishlistCount > 0 && (
                            <span key={wishlistCount} className="animate-bounce" style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: '#e91e63',
                                color: 'white',
                                fontSize: '0.7rem',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>{wishlistCount}</span>
                        )}
                    </Link>

                    <Link to="/cart" style={{ position: 'relative' }}>
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                            <span key={cartCount} className="animate-bounce" style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: 'var(--color-secondary)',
                                color: 'var(--color-primary)',
                                fontSize: '0.7rem',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>{cartCount}</span>
                        )}
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-2">
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user.username}</span>
                            <button onClick={onLogout} style={{ fontSize: '0.9rem', color: 'red' }}>Logout</button>
                        </div>
                    ) : (
                        <Link to="/login"><User size={20} /></Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
