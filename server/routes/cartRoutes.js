import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// ====== GET CART ======
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');

    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== ADD TO CART ======
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity required',
      });
    }

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }

    // Add to cart
    await cart.addItem(productId, quantity, product.price);

    cart = await cart.populate('items.productId');

    res.json({
      success: true,
      message: 'Added to cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== UPDATE CART ITEM ======
router.put('/update/:productId', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    if (quantity <= 0) {
      await cart.removeItem(req.params.productId);
    } else {
      await cart.updateItemQuantity(req.params.productId, quantity);
    }

    const updatedCart = await Cart.findOne({ userId: req.userId }).populate('items.productId');

    res.json({
      success: true,
      message: 'Cart updated',
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== REMOVE FROM CART ======
router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    await cart.removeItem(req.params.productId);

    const updatedCart = await Cart.findOne({ userId: req.userId }).populate('items.productId');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== CLEAR CART ======
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
