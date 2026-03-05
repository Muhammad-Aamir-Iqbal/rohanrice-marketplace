import mongoose from 'mongoose';

const storeOrderItemSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreOrder', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreProduct', required: true, index: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    pricePerKg: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreCustomer', required: true, index: true },
  },
  { timestamps: true, collection: 'order_items' }
);

export default mongoose.models.StoreOrderItem || mongoose.model('StoreOrderItem', storeOrderItemSchema);
