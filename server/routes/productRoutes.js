import express from 'express';
import Product from '../models/Product.js';
import { searchProducts, indexProduct } from '../config/algolia.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// ====== GET ALL PRODUCTS ======
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 12, category, variety, sort = '-createdAt' } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (variety) filter.variety = variety;

    // Get products
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== SEARCH PRODUCTS (via Algolia) ======
router.get('/search/ai', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query required',
      });
    }

    // Search via Algolia
    const results = await searchProducts(q);

    res.json({
      success: true,
      results,
      count: results.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== GET FEATURED PRODUCTS ======
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .limit(6)
      .sort({ rating: -1, reviewCount: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== GET PRODUCT VARIETIES ======
router.get('/varieties/list', async (req, res) => {
  try {
    const varieties = [
      'Premium Basmati',
      '1121 Basmati',
      'Super Kernel',
      'IRRI-6',
      'Sella',
      'Brown Rice',
    ];

    const varietyData = await Promise.all(
      varieties.map(async (variety) => {
        const count = await Product.countDocuments({ variety, isActive: true });
        const avgPrice = await Product.find({ variety, isActive: true })
          .select('price')
          .then(products =>
            products.length > 0
              ? (products.reduce((a, b) => a + b.price, 0) / products.length).toFixed(2)
              : 0
          );

        return { variety, count, avgPrice };
      })
    );

    res.json({
      success: true,
      varieties: varietyData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== GET SINGLE PRODUCT ======
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
