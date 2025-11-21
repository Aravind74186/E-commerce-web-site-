import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';

const Cart = ({ cart, removeFromCart }) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="container section-padding text-center">
                <h2 style={{ marginBottom: '1rem' }}>Your Cart is Empty</h2>
                <p style={{ marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
                <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="cart section-padding">
            <div className="container">
                <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>

                <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
                    <div>
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center gap-4" style={{
                                padding: '1.5rem',
                                borderBottom: '1px solid #eee',
                                backgroundColor: 'white',
                                marginBottom: '1rem',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                <div style={{ flex: 1 }}>
                                    <h3>{item.name}</h3>
                                    <p style={{ color: 'var(--color-text-light)' }}>{item.category}</p>
                                    <p style={{ marginTop: '0.5rem' }}>Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>₹{item.price * item.quantity}</p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{ color: 'red', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}
                                    >
                                        <Trash2 size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div style={{
                            backgroundColor: 'var(--color-surface)',
                            padding: '2rem',
                            borderRadius: 'var(--radius-lg)',
                            position: 'sticky',
                            top: '100px'
                        }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
                            <div className="flex justify-between" style={{ marginBottom: '1rem' }}>
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between" style={{ marginBottom: '1rem' }}>
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between" style={{ marginBottom: '2rem', borderTop: '1px solid #ddd', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                                Checkout <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
