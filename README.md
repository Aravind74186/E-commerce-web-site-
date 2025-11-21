# 💎 Kavs Glamstone - E-Commerce Website

A modern, full-featured e-commerce platform for jewelry and cosmetics built with React and Vite.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-6.0.1-646cff.svg)

## 🌟 Features

### Customer Features
- 🛍️ **Product Browsing**: Browse through categories like Earrings, Bracelets, Rings, Necklaces, Hair Clips, Lipstick, and Nail Polish
- 🔍 **Smart Search**: Real-time product search functionality
- 🛒 **Shopping Cart**: Add products to cart with quantity tracking and animations
- ❤️ **Wishlist**: Save favorite items for later
- 💳 **Checkout Process**: Multi-step checkout with payment simulation (Card/UPI)
- 📧 **Order Confirmation**: Automated invoice via email and SMS confirmation
- 📱 **Responsive Design**: Beautiful UI that works on all devices

### Manager Features
- 🔐 **Secure Login**: Role-based authentication (Manager/Customer)
- 📊 **Inventory Dashboard**: Real-time stats on products, stock value, and low stock alerts
- ➕ **Product Management**: Full CRUD operations (Create, Read, Update, Delete)
- 📸 **Image Upload**: Easy product image upload with preview
- 📈 **Stock Management**: Inline stock updates with status indicators
- 📥 **CSV Export**: Export inventory data to CSV for reporting
- 🔎 **Advanced Filtering**: Search and filter products by category

## 🚀 Live Demo

Visit the live site: [Kavs Glamstone](https://github.com/Aravind74186/E-commerce-web-site-)

## 📸 Screenshots

### Home Page
Beautiful landing page with featured products and category navigation.

### Shop Page
Browse all products with search and category filters.

### Inventory Management
Comprehensive dashboard for managers to track and manage products.

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1
- **Build Tool**: Vite 6.0.1
- **Routing**: React Router DOM 7.0.2
- **Icons**: Lucide React 0.468.0
- **Animations**: Framer Motion 11.15.0
- **Styling**: Vanilla CSS with CSS Variables

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aravind74186/E-commerce-web-site-.git
   cd E-commerce-web-site-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Login Credentials

### Manager Access
- **Username**: `admin`
- **Password**: `admin123`
- Access to inventory management and all features

### Customer Access
- **Username**: `user`
- **Password**: `user123`
- Standard shopping experience

## 📁 Project Structure

```
Aravind/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with cart/wishlist badges
│   │   └── Footer.jsx          # Footer component
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Shop.jsx            # Product listing with filters
│   │   ├── ProductDetails.jsx  # Individual product page
│   │   ├── Cart.jsx            # Shopping cart
│   │   ├── Wishlist.jsx        # Saved items
│   │   ├── Checkout.jsx        # Multi-step checkout
│   │   ├── Login.jsx           # Authentication page
│   │   └── Inventory.jsx       # Manager dashboard
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Key Features Explained

### Shopping Cart Animation
When adding items to cart, you'll see:
- Bounce animation on cart badge
- Shake animation on "Add to Cart" button
- Real-time quantity updates

### Inventory Management
Managers can:
- View dashboard with total products, stock value, and low stock alerts
- Add/Edit/Delete products with image upload
- Update stock quantities inline
- Export inventory to CSV
- Search and filter products

### Checkout Flow
1. **Shipping Details**: Enter name, email, phone, and address
2. **Payment Method**: Choose between Card or UPI
3. **Confirmation**: Receive transaction ID, email invoice, and SMS

## 💰 Currency

All prices are displayed in Indian Rupees (₹)

## 🎯 Future Enhancements

- [ ] Backend integration with database
- [ ] Real payment gateway integration
- [ ] User registration and profile management
- [ ] Order history and tracking
- [ ] Product reviews and ratings
- [ ] Advanced analytics for managers
- [ ] Email notifications
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Aravind**
- GitHub: [@Aravind74186](https://github.com/Aravind74186)

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- Built with ❤️ using React and Vite

---

⭐ If you like this project, please give it a star on GitHub!
