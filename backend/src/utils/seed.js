require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");

const products = [
  { name: "Wireless Headphones", description: "Over-ear Bluetooth headphones with 30-hour battery life.", price: 89.99, stock: 25, category: "Electronics", imageQuery: "wireless headphones" },
  { name: "Smart Watch", description: "Fitness tracking, heart rate monitor, and notifications.", price: 149.99, stock: 15, category: "Electronics", imageQuery: "smart watch" },
  { name: "Portable Speaker", description: "Waterproof speaker with deep bass and 12-hour playtime.", price: 45.5, stock: 30, category: "Electronics", imageQuery: "portable bluetooth speaker" },
  { name: "Cotton Crew T-Shirt", description: "Soft 100% cotton tee, available in multiple colors.", price: 19.99, stock: 60, category: "Clothing", imageQuery: "white cotton t-shirt" },
  { name: "Denim Jacket", description: "Classic fit denim jacket with two front pockets.", price: 64.0, stock: 12, category: "Clothing", imageQuery: "denim jacket" },
  { name: "Running Sneakers", description: "Lightweight everyday running shoes with cushioned soles.", price: 79.95, stock: 20, category: "Clothing", imageQuery: "running sneakers" },
  { name: "Modern Web Development Guide", description: "A practical guide to building full-stack apps with JavaScript.", price: 34.5, stock: 18, category: "Books", imageQuery: "programming book" },
  { name: "Data Structures Workbook", description: "Exercises and solutions for arrays, trees, graphs, and more.", price: 28.0, stock: 22, category: "Books", imageQuery: "open textbook notes" },
  { name: "Ceramic Coffee Mug", description: "350 ml handmade ceramic mug, dishwasher safe.", price: 12.5, stock: 50, category: "Home", imageQuery: "ceramic coffee mug" },
  { name: "Desk Lamp", description: "Adjustable LED desk lamp with three brightness levels.", price: 34.99, stock: 9, category: "Home", imageQuery: "desk lamp" },
];

const fallbackImage = (name) =>
  `https://placehold.co/600x400?text=${encodeURIComponent(name)}`;

const fetchImage = async (query, name) => {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return fallbackImage(name);

  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "1");
    url.searchParams.set("orientation", "landscape");

    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${key}` },
    });
    if (!res.ok) throw new Error(`Unsplash returned ${res.status}`);

    const data = await res.json();
    const photo = data.results[0];
    return photo ? photo.urls.regular : fallbackImage(name);
  } catch (err) {
    console.warn(`Using placeholder for "${name}": ${err.message}`);
    return fallbackImage(name);
  }
};

const seed = async () => {
  await connectDB();
  await Product.deleteMany({});

  const withImages = [];
  for (const { imageQuery, ...product } of products) {
    const image = await fetchImage(imageQuery, product.name);
    withImages.push({ ...product, image });
    console.log(`Fetched image for ${product.name}`);
  }

  await Product.insertMany(withImages);
  console.log(`Seeded ${withImages.length} products`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});