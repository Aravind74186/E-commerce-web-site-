import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, CheckCircle, Printer, Mail, MessageSquare } from 'lucide-react';

const Checkout = ({ cart, clearCart }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        paymentMethod: 'card'
    });

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate Payment Gateway Processing
        setTimeout(() => {
            setLoading(false);
            setStep(3);
            clearCart();
        }, 2000);
    };

    if (cart.length === 0 && step !== 3) {
        return (
            <div className="container section-padding text-center">
                <h2>Your cart is empty</h2>
                <button className="btn btn-primary" onClick={() => navigate('/shop')} style={{ marginTop: '1rem' }}>
                    Return to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="checkout section-padding" style={{ backgroundColor: '#f8f9fa', minHeight: '90vh' }}>
            <div className="container" style={{ maxWidth: '800px' }}>

                {/* Progress Steps */}
                <div className="flex justify-between items-center" style={{ marginBottom: '3rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px', backgroundColor: '#ddd', zIndex: 0 }}></div>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: step >= s ? 'var(--color-primary)' : 'white',
                            border: `2px solid ${step >= s ? 'var(--color-primary)' : '#ddd'}`,
                            color: step >= s ? 'white' : '#666',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            position: 'relative',
                            zIndex: 1,
                            transition: 'all 0.3s'
                        }}>
                            {s === 3 && step === 3 ? <CheckCircle size={20} /> : s}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="card animate-fade-in" style={cardStyle}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Shipping Details</h2>
                        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                            <div className="grid gap-4">
                                <div>
                                    <label style={labelStyle}>Full Name</label>
                                    <input required name="name" value={formData.name} onChange={handleInputChange} style={inputStyle} placeholder="John Doe" />
                                </div>
                                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={labelStyle}>Email</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} style={inputStyle} placeholder="john@example.com" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Phone</label>
                                        <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} placeholder="+91 98765 43210" />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Address</label>
                                    <input required name="address" value={formData.address} onChange={handleInputChange} style={inputStyle} placeholder="123 Street Name" />
                                </div>
                                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={labelStyle}>City</label>
                                        <input required name="city" value={formData.city} onChange={handleInputChange} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>ZIP Code</label>
                                        <input required name="zip" value={formData.zip} onChange={handleInputChange} style={inputStyle} />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                    Continue to Payment
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="card animate-fade-in" style={cardStyle}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Payment Method</h2>
                        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: 'var(--radius-sm)' }}>
                            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
                                <span>Total Amount:</span>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{total}</span>
                            </div>
                        </div>

                        <form onSubmit={handlePayment}>
                            <div className="grid gap-4" style={{ marginBottom: '2rem' }}>
                                <label style={{ ...radioLabelStyle, borderColor: formData.paymentMethod === 'card' ? 'var(--color-primary)' : '#ddd' }}>
                                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} style={{ marginRight: '1rem' }} />
                                    <div className="flex items-center gap-2">
                                        <CreditCard size={20} /> Credit/Debit Card
                                    </div>
                                </label>
                                <label style={{ ...radioLabelStyle, borderColor: formData.paymentMethod === 'upi' ? 'var(--color-primary)' : '#ddd' }}>
                                    <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleInputChange} style={{ marginRight: '1rem' }} />
                                    <div className="flex items-center gap-2">
                                        <Smartphone size={20} /> UPI / GPay / PhonePe
                                    </div>
                                </label>
                            </div>

                            {formData.paymentMethod === 'card' && (
                                <div className="grid gap-4 animate-fade-in">
                                    <input required placeholder="Card Number" style={inputStyle} maxLength="16" />
                                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input required placeholder="MM/YY" style={inputStyle} />
                                        <input required placeholder="CVV" style={inputStyle} maxLength="3" />
                                    </div>
                                </div>
                            )}

                            {formData.paymentMethod === 'upi' && (
                                <div className="animate-fade-in">
                                    <input required placeholder="Enter UPI ID (e.g. user@upi)" style={inputStyle} />
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} disabled={loading}>
                                {loading ? 'Processing Payment...' : `Pay ₹${total}`}
                            </button>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div className="card animate-fade-in text-center" style={cardStyle}>
                        <div style={{
                            width: '80px', height: '80px', backgroundColor: '#e8f5e9', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                            color: '#2e7d32'
                        }}>
                            <CheckCircle size={48} />
                        </div>
                        <h1 style={{ marginBottom: '0.5rem' }}>Payment Successful!</h1>
                        <p style={{ color: '#666', marginBottom: '2rem' }}>Transaction ID: #TRX{Date.now().toString().slice(-8)}</p>

                        <div className="grid gap-4" style={{ textAlign: 'left', backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                            <div className="flex items-center gap-3">
                                <Mail size={20} color="var(--color-primary)" />
                                <div>
                                    <p style={{ fontWeight: '600' }}>Invoice Sent</p>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>Sent to {formData.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MessageSquare size={20} color="var(--color-primary)" />
                                <div>
                                    <p style={{ fontWeight: '600' }}>SMS Confirmation</p>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>Sent to {formData.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button className="btn btn-outline" onClick={() => window.print()}>
                                <Printer size={18} style={{ marginRight: '0.5rem' }} /> Print Invoice
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/')}>
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const cardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
};

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid #ddd',
    fontSize: '1rem',
    outline: 'none'
};

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    fontSize: '0.9rem',
    color: '#444'
};

const radioLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

export default Checkout;
