import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, AlertCircle, Package, DollarSign, X } from 'lucide-react';

const Inventory = ({ products, updateStock, addProduct, deleteProduct, updateProduct }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const [formData, setFormData] = useState({
        name: '',
        category: 'Jewelry',
        price: '',
        stock: '',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=200',
        description: ''
    });

    // Derived State for Dashboard
    const stats = useMemo(() => {
        const totalProducts = products.length;
        const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
        const lowStock = products.filter(p => p.stock < 10).length;
        return { totalProducts, totalValue, lowStock };
    }, [products]);

    // Filtered Products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(products.map(p => p.category))];

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category: 'Jewelry',
                price: '',
                stock: '',
                image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=200',
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock)
        };

        if (editingProduct) {
            updateProduct({ ...productData, id: editingProduct.id });
        } else {
            addProduct(productData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    return (
        <div className="inventory section-padding" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div className="container">

                {/* Header */}
                <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Inventory Management</h1>
                        <p style={{ color: 'var(--color-text-light)' }}>Manage your products, stock levels, and pricing.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn btn-outline" onClick={() => {
                            const headers = ['ID', 'Name', 'Category', 'Price', 'Stock', 'Description'];
                            const csvContent = [
                                headers.join(','),
                                ...products.map(p => [
                                    p.id,
                                    `"${p.name}"`,
                                    p.category,
                                    p.price,
                                    p.stock,
                                    `"${p.description}"`
                                ].join(','))
                            ].join('\n');

                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
                            link.click();
                        }}>
                            <Package size={20} style={{ marginRight: '0.5rem' }} /> Export CSV
                        </button>
                        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                            <Plus size={20} style={{ marginRight: '0.5rem' }} /> Add Product
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: '2rem' }}>
                    <div className="stat-card" style={cardStyle}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Total Products</p>
                                <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>{stats.totalProducts}</h3>
                            </div>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#e3f2fd', color: '#1976d2' }}><Package size={24} /></div>
                        </div>
                    </div>
                    <div className="stat-card" style={cardStyle}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Total Stock Value</p>
                                <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>₹{stats.totalValue.toLocaleString()}</h3>
                            </div>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#e8f5e9', color: '#2e7d32' }}><DollarSign size={24} /></div>
                        </div>
                    </div>
                    <div className="stat-card" style={cardStyle}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Low Stock Items</p>
                                <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem', color: stats.lowStock > 0 ? '#d32f2f' : 'inherit' }}>{stats.lowStock}</h3>
                            </div>
                            <div style={{ ...iconBoxStyle, backgroundColor: '#ffebee', color: '#c62828' }}><AlertCircle size={24} /></div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ ...inputStyle, paddingLeft: '3rem', width: '100%' }}
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{ ...inputStyle, minWidth: '150px' }}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                {/* Products Table */}
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                                    <th style={thStyle}>Product</th>
                                    <th style={thStyle}>Category</th>
                                    <th style={thStyle}>Price</th>
                                    <th style={thStyle}>Stock</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map(product => (
                                        <tr key={product.id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s' }} className="hover-row">
                                            <td style={tdStyle}>
                                                <div className="flex items-center gap-4">
                                                    <img src={product.image} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                                                    <div>
                                                        <div style={{ fontWeight: '600' }}>{product.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>ID: #{product.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}><span style={badgeStyle}>{product.category}</span></td>
                                            <td style={tdStyle}>₹{product.price}</td>
                                            <td style={tdStyle}>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={product.stock}
                                                        onChange={(e) => updateStock(product.id, e.target.value)}
                                                        style={{ ...inputStyle, width: '80px', padding: '0.25rem 0.5rem' }}
                                                    />
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                {product.stock === 0 ? (
                                                    <span style={{ ...statusBadgeStyle, backgroundColor: '#ffebee', color: '#c62828' }}>Out of Stock</span>
                                                ) : product.stock < 10 ? (
                                                    <span style={{ ...statusBadgeStyle, backgroundColor: '#fff3e0', color: '#ef6c00' }}>Low Stock</span>
                                                ) : (
                                                    <span style={{ ...statusBadgeStyle, backgroundColor: '#e8f5e9', color: '#2e7d32' }}>In Stock</span>
                                                )}
                                            </td>
                                            <td style={tdStyle}>
                                                <div className="flex gap-2">
                                                    <button className="btn-icon" onClick={() => handleOpenModal(product)} title="Edit">
                                                        <Edit size={18} color="var(--color-primary)" />
                                                    </button>
                                                    <button className="btn-icon" onClick={() => handleDelete(product.id)} title="Delete">
                                                        <Trash2 size={18} color="#d32f2f" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                                            No products found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div>
                                <label style={labelStyle}>Product Name</label>
                                <input
                                    style={inputStyle}
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Category</label>
                                    <select
                                        style={inputStyle}
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Earrings</option>
                                        <option>Bracelet</option>
                                        <option>Rings</option>
                                        <option>Necklaces</option>
                                        <option>Hair Clips</option>
                                        <option>Lipstick</option>
                                        <option>Nail Polish</option>
                                        <option>Accessories</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Price (₹)</label>
                                    <input
                                        type="number"
                                        style={inputStyle}
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Stock Quantity</label>
                                    <input
                                        type="number"
                                        style={inputStyle}
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData, image: reader.result });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        style={inputStyle}
                                    />
                                    {formData.image && (
                                        <img src={formData.image} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '4px' }} />
                                    )}
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Description</label>
                                <textarea
                                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-4" style={{ marginTop: '1rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingProduct ? 'Update Product' : 'Save Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Styles
const cardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid #eee'
};

const iconBoxStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid #ddd',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s'
};

const thStyle = {
    padding: '1rem 1.5rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const tdStyle = {
    padding: '1rem 1.5rem',
    verticalAlign: 'middle'
};

const badgeStyle = {
    backgroundColor: '#f0f0f0',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    color: '#555'
};

const statusBadgeStyle = {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500'
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: 'var(--shadow-xl)'
};

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    fontSize: '0.9rem',
    color: '#444'
};

export default Inventory;
