import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  totalItems: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    index: { expires: 0 }, // TTL index
  },
}, { timestamps: true });

// Calculate totals
cartSchema.methods.calculateTotals = function() {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.lastUpdated = new Date();
  return this.save();
};

// Add item to cart
cartSchema.methods.addItem = async function(productId, quantity, price) {
  const existingItem = this.items.find(item => item.productId.toString() === productId.toString());

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      productId,
      quantity,
      price,
    });
  }

  return this.calculateTotals();
};

// Remove item from cart
cartSchema.methods.removeItem = async function(productId) {
  this.items = this.items.filter(item => item.productId.toString() !== productId.toString());
  return this.calculateTotals();
};

// Clear cart
cartSchema.methods.clearCart = async function() {
  this.items = [];
  return this.calculateTotals();
};

// Update item quantity
cartSchema.methods.updateItemQuantity = async function(productId, quantity) {
  const item = this.items.find(item => item.productId.toString() === productId.toString());
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    item.quantity = quantity;
    return this.calculateTotals();
  }
  return this;
};

export default mongoose.model('Cart', cartSchema);
