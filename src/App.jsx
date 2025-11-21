import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Inventory from './pages/Inventory';
import Footer from './components/Footer';

// Mock Data for Initial State (Simulating Backend)
const INITIAL_PRODUCTS = [
    { id: 1, name: 'Diamond Stud Earrings', category: 'Earrings', price: 299, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', stock: 10, description: 'Elegant diamond studs suitable for any occasion.' },
    { id: 2, name: 'Gold Chain Bracelet', category: 'Bracelet', price: 150, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', stock: 15, description: 'Classic gold chain bracelet.' },
    { id: 3, name: 'Pearl Hair Clip', category: 'Hair Clips', price: 25, image: 'https://images.unsplash.com/photo-1589128777073-263566ce5c95?auto=format&fit=crop&q=80&w=800', stock: 50, description: 'Vintage inspired pearl hair clip.' },
    { id: 4, name: 'Ruby Red Lipstick', category: 'Lipstick', price: 35, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800', stock: 100, description: 'Long-lasting matte ruby red lipstick.' },
    { id: 5, name: 'Midnight Blue Nail Polish', category: 'Nail Polish', price: 18, image: 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?auto=format&fit=crop&q=80&w=800', stock: 80, description: 'Deep midnight blue nail polish with a glossy finish.' },
    { id: 6, name: 'Sapphire Drop Earrings', category: 'Earrings', price: 450, image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=800', stock: 8, description: 'Stunning sapphire drop earrings.' },
    { id: 7, name: 'Silver Charm Bracelet', category: 'Bracelet', price: 120, image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800', stock: 20, description: 'Sterling silver bracelet with charms.' },
    { id: 8, name: 'Rose Gold Solitaire Ring', category: 'Rings', price: 599, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800', stock: 12, description: 'Minimalist rose gold solitaire ring.' },
    { id: 9, name: 'Emerald Eternity Band', category: 'Rings', price: 899, image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800', stock: 5, description: 'Luxurious emerald eternity band.' },
    { id: 10, name: 'Diamond Pendant Necklace', category: 'Necklaces', price: 750, image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800', stock: 7, description: 'Classic diamond pendant necklace.' },
    { id: 11, name: 'Gold Layered Necklace', category: 'Necklaces', price: 200, image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800', stock: 25, description: 'Trendy gold layered necklace.' },
];

import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';

function App() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateStock = (id, newStock) => {
        // Ensure we don't get NaN or double values by handling empty string
        const stockValue = newStock === '' ? '' : parseInt(newStock);
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: stockValue } : p));
    };

    const addProduct = (newProduct) => {
        setProducts(prev => [...prev, { ...newProduct, id: Date.now() }]);
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const updateProduct = (updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };

    const [wishlist, setWishlist] = useState([]);

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                return prev.filter(item => item.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <div className="app">
            <Navbar
                cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
                wishlistCount={wishlist.length}
                user={user}
                onLogout={handleLogout}
            />
            <main style={{ minHeight: '80vh' }}>
                <Routes>
                    <Route path="/" element={<Home products={products} />} />
                    <Route path="/shop" element={<Shop products={products} addToCart={addToCart} cart={cart} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
                    <Route path="/product/:id" element={<ProductDetails products={products} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
                    <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
                    <Route path="/wishlist" element={<Wishlist wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />} />
                    <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    {user && user.role === 'manager' && (
                        <Route path="/inventory" element={<Inventory
                            products={products}
                            updateStock={updateStock}
                            addProduct={addProduct}
                            deleteProduct={deleteProduct}
                            updateProduct={updateProduct}
                        />} />
                    )}
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
