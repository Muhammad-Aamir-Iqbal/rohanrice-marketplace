import express from 'express';
import { Order } from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { generateOrderNumber } from '../utils/tokenUtils.js';
import { sendOrderEmail } from '../services/emailService.js';
import { sendOrderSMS } from '../services/smsService.js';

const router = express.Router();

// ====== CREATE ORDER ======
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, shippingMethod = 'standard' } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      productName: item.productId.name,
      variety: item.productId.variety,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = shippingMethod === 'express' ? 50 : 20;
    const total = subtotal + tax + shipping;

    // Create order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      userId: req.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingMethod,
      totals: { subtotal, tax, shipping, discount: 0, total },
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    });

    await order.save();

    // Update product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        await product.updateStock(item.quantity);
      }
    }

    // Send confirmation emails
    const user = req.user;
    await sendOrderEmail(order, user.email);
    if (user.phone) {
      await sendOrderSMS(user.phone, order.orderNumber);
    }

    // Clear cart
    await cart.clearCart();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== GET ORDERS ======
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.productId');

    const total = await Order.countDocuments({ userId: req.userId });

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

// ====== GET ORDER BY ID ======
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization
    if (order.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== CANCEL ORDER ======
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel shipped or delivered order',
      });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
