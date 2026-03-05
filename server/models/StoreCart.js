import mongoose from 'mongoose';

const storeCartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreProduct', required: true },
    quantity: { type: Number, required: true, min: 1 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const storeCartSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreCustomer', required: true, unique: true, index: true },
    items: { type: [storeCartItemSchema], default: [] },
  },
  { timestamps: true, collection: 'cart' }
);

export default mongoose.models.StoreCart || mongoose.model('StoreCart', storeCartSchema);
