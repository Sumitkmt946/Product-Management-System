const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/slooze', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'Admin Manager',
        email: 'manager@slooze.com',
        password: 'password123',
        role: 'MANAGER'
      },
      {
        name: 'Store Keeper',
        email: 'keeper@slooze.com',
        password: 'password123',
        role: 'STORE_KEEPER'
      }
    ]);

    console.log('Created users:', users.map(u => ({ name: u.name, email: u.email, role: u.role })));

    // Create sample products
    const products = await Product.create([
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
        category: 'Electronics',
        price: 199.99,
        stock: 50,
        minStock: 10,
        sku: 'WBH-001',
        barcode: '1234567890123',
        createdBy: users[0]._id
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Comfortable office chair with lumbar support and adjustable height.',
        category: 'Furniture',
        price: 299.99,
        stock: 25,
        minStock: 5,
        sku: 'EOC-002',
        barcode: '1234567890124',
        createdBy: users[0]._id
      },
      {
        name: 'Organic Coffee Beans',
        description: 'Premium organic coffee beans from Ethiopia, medium roast.',
        category: 'Food & Beverage',
        price: 24.99,
        stock: 100,
        minStock: 20,
        sku: 'OCB-003',
        barcode: '1234567890125',
        createdBy: users[1]._id
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat made from eco-friendly materials, 6mm thick.',
        category: 'Sports & Fitness',
        price: 39.99,
        stock: 75,
        minStock: 15,
        sku: 'YM-004',
        barcode: '1234567890126',
        createdBy: users[1]._id
      },
      {
        name: 'Smartphone Case',
        description: 'Protective case for iPhone 15 with wireless charging support.',
        category: 'Accessories',
        price: 29.99,
        stock: 200,
        minStock: 30,
        sku: 'SC-005',
        barcode: '1234567890127',
        createdBy: users[0]._id
      }
    ]);

    console.log('Created products:', products.map(p => ({ name: p.name, category: p.category, stock: p.stock })));

    console.log('Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();