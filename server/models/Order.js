import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: String,
  variety: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  shippingAddress: {
    firstName: String,
    lastName: String,
    company: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
    email: String,
  },
  billingAddress: {
    same: { type: Boolean, default: true },
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  totals: {
    subtotal: Number,
    tax: Number,
    shipping: Number,
    discount: Number,
    total: Number,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank-transfer', 'crypto'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'overnight'],
    default: 'standard',
  },
  trackingNumber: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
}, { timestamps: true });

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `RR-${Date.now()}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);
export const OrderItem = mongoose.model('OrderItem', orderItemSchema);
