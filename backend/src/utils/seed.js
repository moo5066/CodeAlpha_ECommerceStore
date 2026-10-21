const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const products = [
  {
    name: 'Classic T-Shirt',
    description: 'Comfortable everyday cotton t-shirt.',
    price: 19.99,
    category: 'Clothing',
    stock: 50,
  },
  {
    name: 'Wireless Headphones',
    description: 'Over-ear headphones with clear wireless audio.',
    price: 59.99,
    category: 'Electronics',
    stock: 25,
  },
  {
    name: 'Everyday Backpack',
    description: 'A durable backpack for work, school, or travel.',
    price: 39.99,
    category: 'Accessories',
    stock: 30,
  },
];

const seed = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Sample products inserted');
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
