import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { bulkIndexProducts } from '../config/algolia.js';
import 'dotenv/config';

const riceProducts = [
  {
    name: 'Premium Basmati Rice',
    variety: 'Premium Basmati',
    description: 'World-class premium basmati rice with extra-long grains, perfect aroma, and superior cooking quality. Ideal for international markets and discerning customers.',
    price: 1.20,
    stock: 500,
    category: 'Premium',
    origin: {
      country: 'India',
      region: 'Punjab',
      farm: 'Heritage Farm Network',
    },
    specifications: {
      length: '8.5-9mm',
      color: 'Ivory white',
      aroma: 'Distinctive basmati fragrance',
      texture: 'Fluffy, non-sticky',
      cookingTime: '18-20 minutes',
      grainIntegrity: '99.5%',
    },
    certifications: [
      {
        name: 'ISO 9001:2015',
        issueDate: new Date('2023-01-15'),
        expiryDate: new Date('2026-01-15'),
        certificateId: 'CERT-ISO-001',
      },
      {
        name: 'FDA Approved',
        issueDate: new Date('2023-06-20'),
        expiryDate: new Date('2025-06-20'),
        certificateId: 'FDA-CERT-001',
      },
    ],
    images: [
      {
        url: '/images/rice-premium-basmati.jpg',
        alt: 'Premium Basmati Rice',
        isPrimary: true,
      },
    ],
    rating: 4.9,
    reviewCount: 234,
    packaging: {
      size: '1kg, 5kg, 25kg, 50kg, bulk',
      material: 'Jute, Foil',
      customizable: true,
    },
    seo: {
      metaTitle: 'Premium Basmati Rice | RohanRice Marketplace',
      metaDescription: 'Buy premium basmati rice direct from Indian exporters. Extra-long grains, superior aroma.',
      keywords: ['basmati rice', 'premium rice', 'Indian basmati', 'export quality rice'],
    },
  },
  {
    name: '1121 Basmati Rice',
    variety: '1121 Basmati',
    description: 'The best-selling basmati variety worldwide. Extra-long grains with  unique aroma. Perfect for retail and export.',
    price: 1.35,
    stock: 300,
    category: 'Premium',
    origin: {
      country: 'India',
      region: 'Haryana',
      farm: 'Select Farms',
    },
    specifications: {
      length: '8.3-8.8mm',
      color: 'Creamy white',
      aroma: 'Strong basmati aroma',
      texture: 'Fluffy',
      cookingTime: '17-19 minutes',
      grainIntegrity: '99.2%',
    },
    certifications: [
      {
        name: 'FSSC 22000',
        issueDate: new Date('2023-03-10'),
        expiryDate: new Date('2026-03-10'),
        certificateId: 'FSSC-001',
      },
    ],
    images: [
      {
        url: '/images/rice-1121-basmati.jpg',
        alt: '1121 Basmati Rice',
        isPrimary: true,
      },
    ],
    rating: 4.8,
    reviewCount: 456,
    packaging: {
      size: '1kg, 5kg, 25kg, 50kg, bulk',
      material: 'Jute, Foil',
      customizable: true,
    },
    seo: {
      metaTitle: '1121 Basmati Rice | World\'s Best Selling Variety',
      metaDescription: 'Export quality 1121 basmati rice. Aromatic, long-grain, perfect cooking.',
      keywords: ['1121 basmati', 'basmati rice exporters', 'long grain rice'],
    },
  },
  {
    name: 'Super Kernel Rice',
    variety: 'Super Kernel',
    description: 'Economy-friendly long-grain rice with excellent cooking properties. Great value for bulk buyers.',
    price: 0.95,
    stock: 1000,
    category: 'Economy',
    origin: {
      country: 'India',
      region: 'Andhra Pradesh',
      farm: 'Farming Cooperative',
    },
    specifications: {
      length: '7.5-8mm',
      color: 'White',
      aroma: 'Mild aroma',
      texture: 'Fluffy',
      cookingTime: '20-22 minutes',
      grainIntegrity: '97%',
    },
    images: [
      {
        url: '/images/rice-super-kernel.jpg',
        alt: 'Super Kernel Rice',
        isPrimary: true,
      },
    ],
    rating: 4.7,
    reviewCount: 189,
    packaging: {
      size: '1kg, 5kg, 25kg, 50kg, bulk',
      material: 'Jute, Plastic',
      customizable: true,
    },
    seo: {
      metaTitle: 'Super Kernel Long Grain Rice | Budget Friendly',
      metaDescription: 'Affordable long-grain rice for wholesale. High yield, reliable quality.',
      keywords: ['long grain rice', 'wholesale rice', 'economy rice exporters'],
    },
  },
  {
    name: 'IRRI-6 Rice',
    variety: 'IRRI-6',
    description: 'International Rice Research Institute certified rice. High yield, disease-resistant. Popular in South Asia and Africa.',
    price: 0.75,
    stock: 800,
    category: 'Economy',
    origin: {
      country: 'India',
      region: 'Punjab',
    },
    specifications: {
      length: '6.5-7mm',
      color: 'White',
      aroma: 'Minimal',
      texture: 'Firm',
      cookingTime: '22-25 minutes',
      grainIntegrity: '98%',
    },
    images: [
      {
        url: '/images/rice-irri-6.jpg',
        alt: 'IRRI-6 Rice',
        isPrimary: true,
      },
    ],
    rating: 4.6,
    reviewCount: 78,
    packaging: {
      size: '5kg, 25kg, 50kg, bulk',
      material: 'Jute',
      customizable: false,
    },
    seo: {
      metaTitle: 'IRRI-6 Rice | High Yield International Variety',
      metaDescription: 'IRRI certified rice variety. Disease-resistant, high yielding, affordable.',
      keywords: ['IRRI rice', 'international rice varieties', 'bulk rice export'],
    },
  },
  {
    name: 'Sella (Parboiled) Rice',
    variety: 'Sella',
    description: 'Traditional golden parboiled rice with unique nutritional profile. Popular in Middle East and African markets.',
    price: 0.85,
    stock: 600,
    category: 'Specialty',
    origin: {
      country: 'India',
      region: 'Andhra Pradesh',
    },
    specifications: {
      length: '6.8-7.5mm',
      color: 'Golden',
      aroma: 'Mild',
      texture: 'Firm, non-sticky',
      cookingTime: '20-23 minutes',
      grainIntegrity: '98.5%',
    },
    images: [
      {
        url: '/images/rice-sella.jpg',
        alt: 'Sella Rice',
        isPrimary: true,
      },
    ],
    rating: 4.5,
    reviewCount: 92,
    packaging: {
      size: '5kg, 25kg, 50kg, bulk',
      material: 'Jute, Foil',
      customizable: true,
    },
    seo: {
      metaTitle: 'Sella Parboiled Rice | Golden Rice Export',
      metaDescription: 'Traditional parboiled sella rice. Nutritious, versatile, bulk export available.',
      keywords: ['sella rice', 'parboiled rice', 'golden rice export'],
    },
  },
  {
    name: 'Brown Rice',
    variety: 'Brown Rice',
    description: 'Whole grain brown rice with bran intact. High nutritional value, eco-friendly. Growing demand in health-conscious markets.',
    price: 1.10,
    stock: 400,
    category: 'Specialty',
    origin: {
      country: 'India',
      region: 'Punjab',
    },
    specifications: {
      length: '7-7.5mm',
      color: 'Brown',
      aroma: 'Nutty',
      texture: 'Chewy',
      cookingTime: '30-35 minutes',
      grainIntegrity: '96%',
    },
    certifications: [
      {
        name: 'Organic Certified',
        issueDate: new Date('2023-05-01'),
        expiryDate: new Date('2026-05-01'),
        certificateId: 'ORG-001',
      },
    ],
    images: [
      {
        url: '/images/rice-brown.jpg',
        alt: 'Brown Rice',
        isPrimary: true,
      },
    ],
    rating: 4.8,
    reviewCount: 156,
    packaging: {
      size: '1kg, 5kg, 25kg, 50kg',
      material: 'Jute, Foil',
      customizable: true,
    },
    seo: {
      metaTitle: 'Organic Brown Rice | Whole Grain Rice Export',
      metaDescription: 'Nutritious brown rice with bran intact. Organic certified, healthy choice.',
      keywords: ['brown rice', 'whole grain rice', 'organic rice export'],
    },
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rohanrice');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(riceProducts);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Index in Algolia
    await bulkIndexProducts(insertedProducts);
    console.log('✅ Indexed products in Algolia');

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
