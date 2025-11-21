import os
import zipfile
from pathlib import Path

def create_project():
    """Generate complete Fancy Store Billing System"""
    
    project_name = "fancy-store-billing"
    
    # File contents dictionary
    files = {
        'requirements.txt': '''Flask==2.3.0
Flask-SQLAlchemy==3.0.5
Flask-Login==0.6.2
Werkzeug==2.3.0
reportlab==4.0.4
openpyxl==3.1.2
pandas==2.0.3
twilio==8.5.0
Pillow==10.0.0
python-dotenv==1.0.0''',

        'config.py': '''import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'fancy-store-secret-key-2024'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Store Information
    STORE_NAME = "Fancy Store"
    STORE_ADDRESS = "123, MG Road, Bangalore - 560001, Karnataka, India"
    STORE_PHONE = "+91 98765 43210"
    STORE_EMAIL = "contact@fancystore.in"
    STORE_GSTIN = "29ABCDE1234F1Z5"
    
    # Invoice Settings
    INVOICE_PREFIX = "FANCY"
    
    # WhatsApp Settings (Twilio)
    TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID') or 'your_account_sid'
    TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN') or 'your_auth_token'
    TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886'
    
    # GST Rates
    GST_RATES = [0, 5, 12, 18, 28]
    
    # Upload folder
    UPLOAD_FOLDER = 'static/uploads'
    INVOICE_FOLDER = 'invoices'
''',

        'models.py': '''from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='cashier')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    product_code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    gst_rate = db.Column(db.Float, default=18.0)
    stock_quantity = db.Column(db.Integer, default=0)
    min_stock_level = db.Column(db.Integer, default=10)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_code': self.product_code,
            'name': self.name,
            'category': self.category,
            'price': self.price,
            'gst_rate': self.gst_rate,
            'stock_quantity': self.stock_quantity,
            'min_stock_level': self.min_stock_level
        }

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    email = db.Column(db.String(120))
    address = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    invoices = db.relationship('Invoice', backref='customer', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'address': self.address
        }

class Invoice(db.Model):
    __tablename__ = 'invoices'
    
    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    customer_name = db.Column(db.String(200))
    customer_phone = db.Column(db.String(15))
    
    subtotal = db.Column(db.Float, default=0)
    cgst_amount = db.Column(db.Float, default=0)
    sgst_amount = db.Column(db.Float, default=0)
    total_gst = db.Column(db.Float, default=0)
    discount = db.Column(db.Float, default=0)
    round_off = db.Column(db.Float, default=0)
    grand_total = db.Column(db.Float, default=0)
    
    payment_method = db.Column(db.String(50), default='Cash')
    status = db.Column(db.String(20), default='Paid')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    items = db.relationship('InvoiceItem', backref='invoice', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'invoice_number': self.invoice_number,
            'customer_name': self.customer_name,
            'customer_phone': self.customer_phone,
            'grand_total': self.grand_total,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'items': [item.to_dict() for item in self.items]
        }

class InvoiceItem(db.Model):
    __tablename__ = 'invoice_items'
    
    id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoices.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    product_name = db.Column(db.String(200))
    product_code = db.Column(db.String(50))
    
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    gst_rate = db.Column(db.Float, default=0)
    gst_amount = db.Column(db.Float, default=0)
    total = db.Column(db.Float, nullable=False)
    
    def to_dict(self):
        return {
            'product_name': self.product_name,
            'product_code': self.product_code,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'gst_rate': self.gst_rate,
            'total': self.total
        }
''',

        'app.py': '''from flask import Flask, render_template, request, jsonify, send_file, redirect, url_for, flash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db, User, Product, Customer, Invoice, InvoiceItem
from config import Config
from datetime import datetime, timedelta
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
import pandas as pd
from twilio.rest import Client

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def init_database():
    with app.app_context():
        db.create_all()
        
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', email='admin@fancystore.in', role='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            
            cashier = User(username='cashier', email='cashier@fancystore.in', role='cashier')
            cashier.set_password('cashier123')
            db.session.add(cashier)
        
        if Product.query.count() == 0:
            sample_products = [
                {'code': 'ER001', 'name': 'Crystal Drop Earrings', 'category': 'Earrings', 'price': 299, 'gst': 12, 'stock': 50},
                {'code': 'ER002', 'name': 'Golden Hoop Earrings', 'category': 'Earrings', 'price': 399, 'gst': 12, 'stock': 30},
                {'code': 'BG001', 'name': 'Designer Bangles Set (6pcs)', 'category': 'Bangles', 'price': 599, 'gst': 12, 'stock': 25},
                {'code': 'BG002', 'name': 'Stone Studded Bangles', 'category': 'Bangles', 'price': 799, 'gst': 12, 'stock': 20},
                {'code': 'HC001', 'name': 'Butterfly Hair Clip', 'category': 'Hair Accessories', 'price': 149, 'gst': 18, 'stock': 100},
                {'code': 'HC002', 'name': 'Pearl Hair Band', 'category': 'Hair Accessories', 'price': 199, 'gst': 18, 'stock': 75},
                {'code': 'BR001', 'name': 'Charm Bracelet', 'category': 'Bracelets', 'price': 449, 'gst': 12, 'stock': 40},
                {'code': 'BR002', 'name': 'Beaded Bracelet', 'category': 'Bracelets', 'price': 249, 'gst': 12, 'stock': 60},
                {'code': 'CL001', 'name': 'Mini Hair Clips (12pcs)', 'category': 'Clips', 'price': 99, 'gst': 18, 'stock': 150},
                {'code': 'NK001', 'name': 'Pendant Necklace', 'category': 'Necklaces', 'price': 899, 'gst': 12, 'stock': 15},
            ]
            
            for p in sample_products:
                product = Product(
                    product_code=p['code'],
                    name=p['name'],
                    category=p['category'],
                    price=p['price'],
                    gst_rate=p['gst'],
                    stock_quantity=p['stock'],
                    min_stock_level=10
                )
                db.session.add(product)
        
        if Customer.query.count() == 0:
            customer = Customer(name='Walk-in Customer', phone='0000000000', email='walkin@store.com')
            db.session.add(customer)
        
        db.session.commit()
        print("✅ Database initialized with sample data!")

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        
        if user and user.check_password(data['password']):
            login_user(user)
            return jsonify({'success': True, 'message': 'Login successful!'})
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    total_products = Product.query.count()
    total_customers = Customer.query.count()
    
    today = datetime.now().date()
    today_start = datetime.combine(today, datetime.min.time())
    today_invoices = Invoice.query.filter(Invoice.created_at >= today_start).all()
    today_sales = sum(inv.grand_total for inv in today_invoices)
    today_count = len(today_invoices)
    
    month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0)
    month_invoices = Invoice.query.filter(Invoice.created_at >= month_start).all()
    month_sales = sum(inv.grand_total for inv in month_invoices)
    
    low_stock = Product.query.filter(Product.stock_quantity <= Product.min_stock_level).all()
    recent_invoices = Invoice.query.order_by(Invoice.created_at.desc()).limit(5).all()
    
    top_products = db.session.query(
        Product.name,
        db.func.sum(InvoiceItem.quantity).label('total_sold')
    ).join(InvoiceItem).group_by(Product.id).order_by(db.desc('total_sold')).limit(5).all()
    
    return render_template('dashboard.html',
        total_products=total_products,
        total_customers=total_customers,
        today_sales=today_sales,
        today_count=today_count,
        month_sales=month_sales,
        low_stock=low_stock,
        recent_invoices=recent_invoices,
        top_products=top_products
    )

@app.route('/products')
@login_required
def products():
    return render_template('products.html')

@app.route('/api/products', methods=['GET'])
@login_required
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

@app.route('/api/products/<int:id>', methods=['GET'])
@login_required
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

@app.route('/api/products', methods=['POST'])
@login_required
def create_product():
    data = request.get_json()
    
    if not data.get('product_code'):
        category_prefix = data['category'][:2].upper()
        count = Product.query.filter(Product.category == data['category']).count()
        data['product_code'] = f"{category_prefix}{count+1:03d}"
    
    product = Product(
        product_code=data['product_code'],
        name=data['name'],
        category=data['category'],
        price=float(data['price']),
        gst_rate=float(data.get('gst_rate', 18)),
        stock_quantity=int(data.get('stock_quantity', 0)),
        min_stock_level=int(data.get('min_stock_level', 10)),
        description=data.get('description', '')
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({'success': True, 'product': product.to_dict()})

@app.route('/api/products/<int:id>', methods=['PUT'])
@login_required
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    
    product.name = data['name']
    product.category = data['category']
    product.price = float(data['price'])
    product.gst_rate = float(data['gst_rate'])
    product.stock_quantity = int(data['stock_quantity'])
    product.min_stock_level = int(data.get('min_stock_level', 10))
    product.description = data.get('description', '')
    
    db.session.commit()
    
    return jsonify({'success': True, 'product': product.to_dict()})

@app.route('/api/products/<int:id>', methods=['DELETE'])
@login_required
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/customers')
@login_required
def customers():
    return render_template('customers.html')

@app.route('/api/customers', methods=['GET'])
@login_required
def get_customers():
    customers = Customer.query.all()
    return jsonify([c.to_dict() for c in customers])

@app.route('/api/customers', methods=['POST'])
@login_required
def create_customer():
    data = request.get_json()
    
    customer = Customer(
        name=data['name'],
        phone=data['phone'],
        email=data.get('email', ''),
        address=data.get('address', '')
    )
    
    db.session.add(customer)
    db.session.commit()
    
    return jsonify({'success': True, 'customer': customer.to_dict()})

@app.route('/api/customers/<int:id>/invoices', methods=['GET'])
@login_required
def get_customer_invoices(id):
    customer = Customer.query.get_or_404(id)
    invoices = Invoice.query.filter_by(customer_id=id).order_by(Invoice.created_at.desc()).all()
    return jsonify([inv.to_dict() for inv in invoices])

@app.route('/billing')
@login_required
def billing():
    return render_template('billing.html')

@app.route('/api/search-products')
@login_required
def search_products():
    query = request.args.get('q', '')
    products = Product.query.filter(
        db.or_(
            Product.name.ilike(f'%{query}%'),
            Product.product_code.ilike(f'%{query}%'),
            Product.category.ilike(f'%{query}%')
        )
    ).limit(10).all()
    
    return jsonify([p.to_dict() for p in products])

@app.route('/api/invoices', methods=['POST'])
@login_required
def create_invoice():
    data = request.get_json()
    
    last_invoice = Invoice.query.order_by(Invoice.id.desc()).first()
    if last_invoice:
        last_num = int(last_invoice.invoice_number.replace(app.config['INVOICE_PREFIX'], ''))
        invoice_num = f"{app.config['INVOICE_PREFIX']}{last_num + 1:04d}"
    else:
        invoice_num = f"{app.config['INVOICE_PREFIX']}0001"
    
    invoice = Invoice(
        invoice_number=invoice_num,
        customer_name=data['customer_name'],
        customer_phone=data['customer_phone'],
        subtotal=data['subtotal'],
        cgst_amount=data['cgst_amount'],
        sgst_amount=data['sgst_amount'],
        total_gst=data['total_gst'],
        discount=data.get('discount', 0),
        round_off=data['round_off'],
        grand_total=data['grand_total'],
        payment_method=data.get('payment_method', 'Cash'),
        created_by=current_user.id
    )
    
    customer = Customer.query.filter_by(phone=data['customer_phone']).first()
    if customer:
        invoice.customer_id = customer.id
    else:
        new_customer = Customer(
            name=data['customer_name'],
            phone=data['customer_phone']
        )
        db.session.add(new_customer)
        db.session.flush()
        invoice.customer_id = new_customer.id
    
    db.session.add(invoice)
    db.session.flush()
    
    for item in data['items']:
        invoice_item = InvoiceItem(
            invoice_id=invoice.id,
            product_id=item['product_id'],
            product_name=item['product_name'],
            product_code=item['product_code'],
            quantity=item['quantity'],
            unit_price=item['unit_price'],
            gst_rate=item['gst_rate'],
            gst_amount=item['gst_amount'],
            total=item['total']
        )
        db.session.add(invoice_item)
        
        product = Product.query.get(item['product_id'])
        if product:
            product.stock_quantity -= item['quantity']
    
    db.session.commit()
    
    pdf_path = generate_invoice_pdf(invoice)
    
    return jsonify({
        'success': True,
        'invoice_number': invoice_num,
        'invoice_id': invoice.id,
        'pdf_path': pdf_path
    })

def generate_invoice_pdf(invoice):
    if not os.path.exists(app.config['INVOICE_FOLDER']):
        os.makedirs(app.config['INVOICE_FOLDER'])
    
    filename = f"{invoice.invoice_number}.pdf"
    filepath = os.path.join(app.config['INVOICE_FOLDER'], filename)
    
    doc = SimpleDocTemplate(filepath, pagesize=A4,
                           topMargin=0.5*inch, bottomMargin=0.5*inch,
                           leftMargin=0.5*inch, rightMargin=0.5*inch)
    
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#2c3e50'),
        spaceAfter=10,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    header_style = ParagraphStyle(
        'CustomHeader',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#34495e'),
        alignment=TA_CENTER,
        spaceAfter=20
    )
    
    story.append(Paragraph(app.config['STORE_NAME'], title_style))
    story.append(Paragraph(app.config['STORE_ADDRESS'], header_style))
    story.append(Paragraph(f"Phone: {app.config['STORE_PHONE']} | Email: {app.config['STORE_EMAIL']}", header_style))
    story.append(Paragraph(f"<b>GSTIN: {app.config['STORE_GSTIN']}</b>", header_style))
    
    story.append(Spacer(1, 0.3*inch))
    
    invoice_data = [
        ['Tax Invoice', ''],
        [f'Invoice No: {invoice.invoice_number}', f'Date: {invoice.created_at.strftime("%d-%m-%Y %I:%M %p")}'],
        [f'Customer: {invoice.customer_name}', f'Phone: {invoice.customer_phone}'],
    ]
    
    invoice_table = Table(invoice_data, colWidths=[3.5*inch, 3.5*inch])
    invoice_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#2980b9')),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('SPAN', (0, 0), (-1, 0)),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    story.append(invoice_table)
    story.append(Spacer(1, 0.3*inch))
    
    items_data = [['#', 'Item', 'Code', 'Qty', 'Price', 'GST%', 'GST Amt', 'Total']]
    
    for idx, item in enumerate(invoice.items, 1):
        items_data.append([
            str(idx),
            item.product_name,
            item.product_code,
            str(item.quantity),
            f"₹{item.unit_price:.2f}",
            f"{item.gst_rate}%",
            f"₹{item.gst_amount:.2f}",
            f"₹{item.total:.2f}"
        ])
    
    items_table = Table(items_data, colWidths=[0.3*inch, 2*inch, 0.8*inch, 0.5*inch, 0.8*inch, 0.6*inch, 0.8*inch, 1*inch])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#34495e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    story.append(items_table)
    story.append(Spacer(1, 0.2*inch))
    
    totals_data = [
        ['', 'Subtotal:', f"₹{invoice.subtotal:.2f}"],
        ['', f'CGST:', f"₹{invoice.cgst_amount:.2f}"],
        ['', f'SGST:', f"₹{invoice.sgst_amount:.2f}"],
        ['', f'Total GST:', f"₹{invoice.total_gst:.2f}"],
    ]
    
    if invoice.discount > 0:
        totals_data.append(['', f'Discount:', f"₹{invoice.discount:.2f}"])
    
    totals_data.extend([
        ['', f'Round Off:', f"₹{invoice.round_off:.2f}"],
        ['', f'Grand Total:', f"₹{invoice.grand_total:.2f}"],
    ])
    
    totals_table = Table(totals_data, colWidths=[3.5*inch, 2*inch, 1.5*inch])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (1, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (1, -1), (-1, -1), 12),
        ('TEXTCOLOR', (1, -1), (-1, -1), colors.HexColor('#27ae60')),
        ('LINEABOVE', (1, -1), (-1, -1), 1, colors.black),
        ('FONTSIZE', (1, 0), (-1, -2), 9),
    ]))
    
    story.append(totals_table)
    story.append(Spacer(1, 0.5*inch))
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.grey,
        alignment=TA_CENTER
    )
    
    story.append(Paragraph("Thank you for shopping with us!", footer_style))
    story.append(Paragraph("This is a computer-generated invoice", footer_style))
    
    doc.build(story)
    
    return filepath

@app.route('/api/invoices/<int:id>/download')
@login_required
def download_invoice(id):
    invoice = Invoice.query.get_or_404(id)
    filepath = os.path.join(app.config['INVOICE_FOLDER'], f"{invoice.invoice_number}.pdf")
    
    if not os.path.exists(filepath):
        filepath = generate_invoice_pdf(invoice)
    
    return send_file(filepath, as_attachment=True)

@app.route('/api/invoices/<int:id>/whatsapp', methods=['POST'])
@login_required
def send_invoice_whatsapp(id):
    invoice = Invoice.query.get_or_404(id)
    
    try:
        client = Client(app.config['TWILIO_ACCOUNT_SID'], app.config['TWILIO_AUTH_TOKEN'])
        
        filepath = os.path.join(app.config['INVOICE_FOLDER'], f"{invoice.invoice_number}.pdf")
        if not os.path.exists(filepath):
            filepath = generate_invoice_pdf(invoice)
        
        phone = invoice.customer_phone
        if not phone.startswith('+91'):
            phone = f'+91{phone}'
        
        message = client.messages.create(
            from_=app.config['TWILIO_WHATSAPP_FROM'],
            to=f'whatsapp:{phone}',
            body=f"""Hello {invoice.customer_name},

Thank you for shopping at {app.config['STORE_NAME']}!

Invoice: {invoice.invoice_number}
Total: ₹{invoice.grand_total:.2f}
Date: {invoice.created_at.strftime('%d-%m-%Y')}

Your invoice has been generated. Visit our store again!"""
        )
        
        return jsonify({'success': True, 'message': 'Invoice sent via WhatsApp!'})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/invoices')
@login_required
def invoices():
    return render_template('invoices.html')

@app.route('/api/invoices')
@login_required
def get_invoices():
    invoices = Invoice.query.order_by(Invoice.created_at.desc()).all()
    return jsonify([inv.to_dict() for inv in invoices])

@app.route('/api/invoices/<int:id>')
@login_required
def get_invoice(id):
    invoice = Invoice.query.get_or_404(id)
    return jsonify(invoice.to_dict())

@app.route('/reports')
@login_required
def reports():
    return render_template('reports.html')

@app.route('/api/reports/sales')
@login_required
def sales_report():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Invoice.query
    
    if start_date:
        query = query.filter(Invoice.created_at >= datetime.strptime(start_date, '%Y-%m-%d'))
    if end_date:
        end_dt = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
        query = query.filter(Invoice.created_at < end_dt)
    
    invoices = query.all()
    
    total_sales = sum(inv.grand_total for inv in invoices)
    total_gst = sum(inv.total_gst for inv in invoices)
    total_invoices = len(invoices)
    
    return jsonify({
        'total_sales': total_sales,
        'total_gst': total_gst,
        'total_invoices': total_invoices,
        'invoices': [inv.to_dict() for inv in invoices]
    })

@app.route('/api/reports/export/excel')
@login_required
def export_excel():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Invoice.query
    
    if start_date:
        query = query.filter(Invoice.created_at >= datetime.strptime(start_date, '%Y-%m-%d'))
    if end_date:
        end_dt = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
        query = query.filter(Invoice.created_at < end_dt)
    
    invoices = query.all()
    
    data = []
    for inv in invoices:
        data.append({
            'Invoice No': inv.invoice_number,
            'Date': inv.created_at.strftime('%Y-%m-%d %H:%M'),
            'Customer': inv.customer_name,
            'Phone': inv.customer_phone,
            'Subtotal': inv.subtotal,
            'CGST': inv.cgst_amount,
            'SGST': inv.sgst_amount,
            'Total GST': inv.total_gst,
            'Grand Total': inv.grand_total,
            'Payment': inv.payment_method
        })
    
    df = pd.DataFrame(data)
    
    filename = f'sales_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
    filepath = os.path.join(app.config['INVOICE_FOLDER'], filename)
    
    df.to_excel(filepath, index=False)
    
    return send_file(filepath, as_attachment=True)

if __name__ == '__main__':
    init_database()
    
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['INVOICE_FOLDER'], exist_ok=True)
    
    print("=" * 60)
    print("🛍️  FANCY STORE BILLING SOFTWARE")
    print("=" * 60)
    print("\\n📌 Login Credentials:")
    print("   Admin    - Username: admin    Password: admin123")
    print("   Cashier  - Username: cashier  Password: cashier123")
    print("\\n🌐 Access the application at: http://localhost:5000")
    print("=" * 60 + "\\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
''',

        'static/css/style.css': ''':root {
    --primary: #3498db;
    --success: #27ae60;
    --danger: #e74c3c;
    --warning: #f39c12;
    --dark: #2c3e50;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #ecf0f1;
}

.navbar {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card {
    border: none;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}

.card-header {
    border-radius: 10px 10px 0 0 !important;
    font-weight: 600;
}

.btn {
    border-radius: 5px;
    font-weight: 500;
}

.table {
    margin-bottom: 0;
}

#searchResults {
    position: absolute;
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.badge {
    padding: 5px 10px;
}

@media print {
    .navbar, .btn, .no-print {
        display: none !important;
    }
}''',

        'static/js/main.js': '''function formatCurrency(amount) {
    return `₹${parseFloat(amount).toFixed(2)}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
}

function showToast(message, type = 'success') {
    const toast = `
        <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
            <div class="toast show align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(toast);
    setTimeout(() => $('.toast').remove(), 3000);
}

function confirmAction(message) {
    return confirm(message);
}

function formatNumber(num) {
    return parseFloat(num).toFixed(2);
}''',

        'README.md': '''# 🛍️ Fancy Store - Billing & Inventory Management System

A complete GST-compliant billing software for Indian retail stores built with Flask, Bootstrap, and SQLite.

## ✨ Features

- ✅ **Product Management** - Add/Edit/Delete products with auto-generated codes
- ✅ **GST Billing** - CGST + SGST calculation (5%, 12%, 18%, 28%)
- ✅ **Customer Management** - Save customer data and purchase history
- ✅ **Invoice Generation** - Professional PDF invoices with GST details
- ✅ **WhatsApp Integration** - Send invoices via WhatsApp (Twilio)
- ✅ **Dashboard** - Real-time sales summary and analytics
- ✅ **Reports** - Daily/Monthly sales reports with Excel export
- ✅ **Multi-user Support** - Admin & Cashier roles
- ✅ **Stock Management** - Auto stock deduction and low stock alerts
- ✅ **Offline Ready** - Works without internet using SQLite

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Extract the ZIP file
```bash
cd fancy-store-billing