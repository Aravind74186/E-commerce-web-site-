import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingBag, Heart } from 'lucide-react';

const ProductDetails = ({ products, addToCart, wishlist, toggleWishlist }) => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return <div className="container section-padding">Product not found</div>;
    }

    const isWishlisted = wishlist.some(item => item.id === product.id);

    return (
        <div className="product-details section-padding">
            <div className="container">
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                    <div className="animate-fade-in">
                        <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }} />
                    </div>
                    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <span style={{ backgroundColor: '#f0f0f0', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', color: '#555' }}>
                            {product.category}
                        </span>
                        <h1 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>{product.name}</h1>
                        <p style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: 'bold', marginBottom: '1.5rem' }}>₹{product.price}</p>
                        <p style={{ lineHeight: '1.6', color: '#666', marginBottom: '2rem' }}>{product.description}</p>

                        <div className="flex gap-4">
                            <button
                                className="btn btn-primary"
                                onClick={() => addToCart(product)}
                                style={{ flex: 1 }}
                            >
                                <ShoppingBag size={20} style={{ marginRight: '0.5rem' }} /> Add to Cart
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => toggleWishlist(product)}
                                style={{
                                    borderColor: isWishlisted ? '#e91e63' : '#ddd',
                                    color: isWishlisted ? '#e91e63' : 'inherit'
                                }}
                            >
                                <Heart size={20} fill={isWishlisted ? '#e91e63' : 'none'} />
                            </button>
                        </div>

                        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: product.stock > 0 ? '#2e7d32' : '#c62828' }}></span>
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                {product.stock > 0 ? `Only ${product.stock} left in stock - order soon.` : 'This item is currently unavailable.'}
                            </p>
                        </div>
                        <div className="flex justify-between" style={{ marginTop: '1rem' }}>
                            <span style={{ fontWeight: '600' }}>Shipping:</span>
                            <span>Free Standard Shipping</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
