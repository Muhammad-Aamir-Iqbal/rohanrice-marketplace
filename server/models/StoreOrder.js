import mongoose from 'mongoose';

const ORDER_STATUSES = [
  'PENDING_PAYMENT',
  'PENDING_PAYMENT_VERIFICATION',
  'CONFIRMED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'PAID',
  'COMPLETED',
  'CANCELLED',
];

const storeOrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreProduct', required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    pricePerKg: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const storeOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreCustomer', required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: { type: [storeOrderItemSchema], required: true, default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'easypaisa', 'jazzcash'],
      default: 'cash_on_delivery',
    },
    orderStatus: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'PENDING_PAYMENT',
      index: true,
    },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreWorker', default: null, index: true },
    stockDeducted: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    failedPaymentVerifications: { type: Number, default: 0, min: 0 },
    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String, required: true },
      addressLine: { type: String, required: true },
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true, collection: 'orders' }
);

export default mongoose.models.StoreOrder || mongoose.model('StoreOrder', storeOrderSchema);
