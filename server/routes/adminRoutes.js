import express from 'express';
import Product from '../models/Product.js';
import { Order } from '../models/Order.js';
import User from '../models/User.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { bulkIndexProducts, indexProduct, deleteProductFromIndex } from '../config/algolia.js';
import { emitEvent, emitToRoom } from '../realtime/io.js';

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware, adminMiddleware);

// ====== DASHBOARD STATS ======
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totals.total' } } },
    ]);

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'firstName email');

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalUsers,
        totalProducts,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== PRODUCTS ======

// Create product
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    await indexProduct(product);

    // Broadcast to all clients
    emitEvent('stock-updated', { product, action: 'created' });

    res.status(201).json({
      success: true,
      message: 'Product created',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await indexProduct(product);
    emitEvent('stock-updated', { product, action: 'updated' });

    res.json({
      success: true,
      message: 'Product updated',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await deleteProductFromIndex(req.params.id);
    emitEvent('stock-updated', { productId: req.params.id, action: 'deleted' });

    res.json({
      success: true,
      message: 'Product deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update stock
router.patch('/products/:id/stock', async (req, res) => {
  try {
    const { stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Broadcast real-time update
    emitEvent('stock-updated', {
      productId: product._id,
      stock: product.stock,
      status: product.getAvailabilityStatus(),
    });

    res.json({
      success: true,
      message: 'Stock updated',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== ORDERS ======

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const skip = (page - 1) * limit;
    const filter = {};
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'firstName email');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
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

// Update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, trackingNumber, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Broadcast update to user
    emitToRoom(`user-${order.userId}`, 'order-updated', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      orderStatus,
      trackingNumber,
    });

    res.json({
      success: true,
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== BULK OPERATIONS ======

// Bulk index products (useful after adding multiple products)
router.post('/bulk-index', async (req, res) => {
  try {
    const products = await Product.find();
    await bulkIndexProducts(products);

    res.json({
      success: true,
      message: `Indexed ${products.length} products`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
