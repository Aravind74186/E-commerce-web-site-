import React from 'react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '4rem 0 2rem' }}>
            <div className="container">
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    <div>
                        <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>Luxe Gems & Cosmetics</h3>
                        <p style={{ opacity: 0.8 }}>Premium jewelry and cosmetics for the modern elegance.</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem' }}>Shop</h4>
                        <ul style={{ listStyle: 'none', opacity: 0.8 }}>
                            <li><a href="/shop">All Products</a></li>
                            <li><a href="#">New Arrivals</a></li>
                            <li><a href="#">Best Sellers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem' }}>Support</h4>
                        <ul style={{ listStyle: 'none', opacity: 0.8 }}>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Shipping & Returns</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem' }}>Newsletter</h4>
                        <div className="flex">
                            <input type="email" placeholder="Your email" style={{
                                padding: '0.5rem',
                                borderRadius: '4px 0 0 4px',
                                border: 'none',
                                outline: 'none',
                                width: '100%'
                            }} />
                            <button style={{
                                backgroundColor: 'var(--color-secondary)',
                                padding: '0.5rem 1rem',
                                borderRadius: '0 4px 4px 0',
                                fontWeight: 'bold'
                            }}>Join</button>
                        </div>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '3rem', paddingTop: '1rem', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
                    &copy; 2024 Luxe Gems & Cosmetics. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
