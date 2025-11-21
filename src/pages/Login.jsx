import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
            onLogin({ username: 'admin', role: 'manager' });
            navigate('/inventory');
        } else if (username === 'user' && password === 'user123') {
            onLogin({ username: 'user', role: 'customer' });
            navigate('/');
        } else {
            setError('Invalid credentials. Try admin/admin123');
        }
    };

    return (
        <div className="login-page section-padding" style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-surface)'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '3rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--color-text-light)' }}>Login to access your account</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 3rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 3rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Login <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                    </button>
                </form>

                <div className="text-center" style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                    <p>Manager Access: admin / admin123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
